import React, { useState, useEffect, useRef } from 'react';
import { CustomSocket } from '../Socket';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";





const AuthComponent = ({ modifyLoggedInStatus, setUserInfoOnAppContext, addNewRoomIntoAssociatedRooms, addNewMessageIntoCurrentRoom }) => {
    const [signInUsername, setSignInUsername] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [signUpUsername, setSignUpUsername] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [isSignIn, setIsSignIn] = useState(true);
    const [isSignUp, setIsSignUp] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [preview, setPreview] = useState(null);
    const [base64Image, setBase64Image] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const validateUser = async () => {
            try {
                console.log("Checking Cookie Validity...");
                //replace with http://authentication-service:3200/user/validate when running locally otherwise ensure we have below mappings in /etc/hosts file
                const response = await fetch('/user/validate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jwt: "",
                    }),
                   credentials: 'include', // Include httpOnly cookies in the request
                });
    
                if (!response.ok) {
                    console.log("Something went wrong while validating existing cookie");
                    modifyLoggedInStatus(false); // Set isLoggedIn to false if response is not OK
                    return;
                }
                let validationClaims = await response.json();
                modifyLoggedInStatus(true);
                const headers = {
                    'Authorization': validationClaims.jwt
                }
                console.log("Connecting on auth component load... headers=", headers);
                const socket = CustomSocket(headers).connect();
                await listenSocketEvents(socket);
                //navigate('/chat'); // can be used from component only within react router.. so could not use this in app.js
            } catch (err) {
                console.log('Refresh Login Error: ', err);
                modifyLoggedInStatus(false); // Set isLoggedIn to false in case of error
            }
        };
    
        validateUser(); // Call the async function
    
    }, []); // Empty dependency array ensures the effect runs only once

    const listenSocketEvents = async (socket) => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        socket.on('response', (response) => {
            console.log("response from server- =", response);
            if (response.response_type == 'associatedRoomsOfUserInfo') { //this will happen only after connect event
                setUserInfoOnAppContext(response, socket);
                navigate('/chat');
            }
        });
        socket.on('chat-message', (message) => {
            addNewMessageIntoCurrentRoom(message);
            console.log("chat-message = ", message);
        });
        socket.on('room-joined', (roomInfo) => {
            console.log("room-joined - ", roomInfo);
            addNewRoomIntoAssociatedRooms(roomInfo);
        })

        socket.on('socket-pool-size-changed', (value) => {
            console.log('People Online:- ', value)
            toast.info('People Online:- ' + value)
        })
    }

    const handleSignUpSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', signUpUsername);
            formData.append('email', signUpEmail);
            formData.append('password', signUpPassword);
            formData.append('profile_pic', selectedFile);
            const response = await fetch('/user/register', {
                method: 'POST', // no need to set content-type: multipart/formdata header as it is set automatically by client
                body: formData
            });
            // we can also send json payload with profile_pic as base64 encoded string of read image file
            // But sending as multi-part/form-data is more effcient because
            /*
            The industry standard for sending files (such as images) from a client to a server in an API call is to use FormData rather than embedding the file data as a base64 encoded string in a JSON payload
               Why FormData is Preferred Over Base64 Encoded String ?

                1. Efficiency: File Size: Base64 encoding increases the file size by approximately 33%, leading to larger payloads.
                               Encoding Overhead: Encoding and decoding base64 strings add computational overhead on both the client and server sides.
                2. Simplicity:  File Handling: FormData is specifically designed for handling files and binary data, making it straightforward to use for file uploads.
                                Browser Support: FormData is natively supported by browsers, providing a clean and simple API for handling multipart form data.
                3. Standardization: Content-Type: Using multipart/form-data is a standard way to send files in HTTP requests, and most servers and frameworks are optimized to handle this content type.

            Referred from ChatGPT
            */
            if (!response.ok) {
                toast.error('Bad Response ' + JSON.stringify({ message: response.statusText, statusCode: response.status }), { position: 'top-left' });
                throw new Error({ message: response.statusText, statusCode: response.status });
            }
            const responseData = await response.json();
            toast.success('Sign Up successful, Please Login... \n' + JSON.stringify(responseData), { position: 'top-left' }); // Display success toast
        } catch (error) {
            console.error('Error:', error);
            toast.error('Sign up failed' + error, { position: 'top-left' }); // Display error toast
        }
        setSignUpUsername('');
        setSignUpPassword('');
        setSignUpEmail('');

    };

    const handleSignInSubmit = async (event) => {
        // Establish WebSocket connection
        event.preventDefault();
        let responseData = {};
        //fetch the user details from backend server. TODO:- later Replace this with validation API which validates the creds and returns a JWT
        try {
            //process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
            const response = await fetch('/user/login', {
                method: 'POST',
               
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: signInUsername,
                    password: signInPassword,
                }),
                //agent: new https.Agent({ rejectUnauthorized: false }),
                //credentials: 'include' //needed to make browser set any response headers having set-cookie header 
                
            });
            if (!response.ok) {
                toast.error('Bad Response ' + JSON.stringify({ message: response.statusText, statusCode: response.status }), { position: 'top-left' });
                throw new Error({ message: response.statusText, statusCode: response.status });
            }
            responseData = await response.json();
            if (responseData == null || !responseData.jwt) {
                throw 'Invalid Credentials - User Not Found'
            }
            // const headers = {
            //     'x-ms-user-info': JSON.stringify({
            //         id: responseData.id,
            //         name: responseData.name
            //     })
            // } -> server gateway will create this header when jwt is sent
            //Client side cookie setting:-  document.cookie = `authToken=${responseData.jwt}; Max-Age=86400; SameSite=None; Secure`;
            const headers = {
                'Authorization': responseData.jwt
            }
            const socket = CustomSocket(headers).connect();
            await listenSocketEvents(socket);
            // // Handle connection events
            setSignInUsername('');
            setSignInPassword('');
            modifyLoggedInStatus(true);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Login failed' + error, { position: 'top-left' }); // Display error toast
            //throw error;
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setSelectedFileName(file.name);
    
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result); // we can use this data in img tag src field ex:- src={preview}
          // reader.result is base64 encoded string of the image which will be very large
        };
        if (file) {
          reader.readAsDataURL(file);
        }
      };

      const handleUploadImageDivClick = () => {
        fileInputRef.current.click(); //when the user clicks the div we are simulating a click on the element referenced by the ref variable i.e input element
      };

    return (
        <>
            <div >
                <p style={{ fontSize: '3rem', margin: '1rem', fontFamily: "Pacifico, cursive",fontWeight: 400,fontStyle: 'normal', color: '#5856d6'}}>Megha Sandesham</p>
            </div>
            <div id='authForm' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                {
                    isSignIn &&
                    <div >

                        <h1 style={{fontFamily: "Pacifico, cursive"}}>Sign In</h1>
                        <form onSubmit={handleSignInSubmit}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={signInUsername}
                                onChange={(e) => setSignInUsername(e.target.value)}
                                style={{ marginBottom: '10px', padding: '10px', width: '18rem', height: '2rem', fontSize: '1.2rem' }} // 1 rem = 16px
                            />
                            <br />
                            <input
                                type="password"
                                placeholder="Password"
                                value={signInPassword}
                                onChange={(e) => setSignInPassword(e.target.value)}
                                style={{ marginBottom: '10px', padding: '10px', width: '18rem', height: '2rem', fontSize: '1.2rem' }}
                            />
                            <br />
                            <button type="submit" style={{ padding: '12px 10px', background: 'lightblue', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '8rem',height: '3rem', fontSize: '1rem' }}>Sign In</button>
                            <h4>Click here to <a href='#' style={{ textDecoration: 'none' }} onClick={() => { setIsSignUp(true); setIsSignIn(false) }}>Signup</a> if new user</h4>

                        </form>
                        <ToastContainer />

                    </div>
                }

                {isSignUp &&
                    <div>
                        <h1 style={{fontFamily: "Pacifico, cursive"}}>Sign Up</h1>
                        <form onSubmit={handleSignUpSubmit}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={signUpUsername}
                                onChange={(e) => setSignUpUsername(e.target.value)}
                                style={{ marginBottom: '10px', padding: '10px', width: '18rem', height: '2rem', fontSize: '1.2rem' }}
                            />
                            <br />
                            <input
                                type="mail"
                                placeholder="Email"
                                value={signUpEmail}
                                onChange={(e) => setSignUpEmail(e.target.value)}
                                style={{ marginBottom: '10px', padding: '10px', width: '18rem', height: '2rem', fontSize: '1.2rem' }}
                            />
                            <br />
                            <input
                                type="text"
                                placeholder="New Password"
                                value={signUpPassword}
                                onChange={(e) => setSignUpPassword(e.target.value)}
                                style={{ marginBottom: '10px', padding: '10px', width: '18rem', height: '2rem', fontSize: '1.2rem' }}
                            />
                            <br />
                            <div onClick={handleUploadImageDivClick} style={{border: '1px dashed black', borderRadius: '0.5rem', paddingTop: '3rem', paddingBottom: '3rem', textAlign: 'center', backgroundColor: '#edfffdc4', marginBottom: '10px', cursor: 'pointer'}}>
                                <span style={{color: 'blue'}}> Choose Pic  </span> or Drop here
                            </div> 
                            <div></div>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                ref={fileInputRef} //We are storing the reference of this hidden input element in state using ref
                                onChange={handleFileChange}
                            />
                            {preview && (
                                <div>
                                {/* <h3>Preview:</h3>
                                <img src={preview} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                                 */}
                                 <p> <span style={{ color: 'green', size: '5px' }}>✓</span> {selectedFileName} </p>
                                </div>
                            )}
                            
                            <button type="submit" style={{ padding: '12px 10px', background: 'lightblue', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '8rem',height: '3rem', fontSize: '1rem' }}>Sign Up</button>
                            <h4>Click here to <a href='#' style={{ textDecoration: 'none' }} onClick={() => { setIsSignIn(true); setIsSignUp(false) }}>Login</a></h4>
                        </form>
                        <ToastContainer />
                    </div>
                }
            </div>
            <div >
                <h5 style={{ fontSize: '1rem', margin: '1rem', fontFamily: "Pacifico, cursive",fontWeight: 300,fontStyle: 'normal', color: '#5856d6'}}>Designed with <FaHeart style={{color: 'red'}}/> by Nag Ashish S V</h5>
            </div>
        </>


    );
};

export default AuthComponent;
