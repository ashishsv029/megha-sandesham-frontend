import React, { useState } from 'react';
import { CustomSocket } from '../Socket';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import "react-toastify/dist/ReactToastify.css";





const AuthComponent = ({ modifyLoggedInStatus, setUserInfoOnAppContext }) => {
    const [signInUsername, setSignInUsername] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [signUpUsername, setSignUpUsername] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [isSignIn, setIsSignIn] = useState(true);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const listenSocketEvents = async (socket) => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        socket.on('response', (response) => {
            console.log("response from server- =", response);
            if(response.response_type == 'associatedRoomsOfUserInfo') {
                setUserInfoOnAppContext(response);
                navigate('/chat');

            }
        });
        socket.on('chat-message', (message) => {
            console.log("chat-message = ", message);
        });
        socket.on('room-joined', (value) => {
            console.log("room-joined - ", value)
        })
    
        socket.on('socket-pool-size-changed', (value) => {
            console.log('People Online:- ', value)
            toast.info('People Online:- ' + value)
        })
    }

    const handleSignUpSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3100/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: signUpUsername,
                    email: signUpPassword,
                }),
            });
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

    };

    const handleSignInSubmit = async (event) => {
        // Establish WebSocket connection
        event.preventDefault();
        let responseData = {};
        //fetch the user details from backend server. TODO:- later Replace this with validation API which validates the creds and returns a JWT
        try {
            const response = await fetch(`http://localhost:3100/user?name=${signInUsername}&email=${signInPassword}`);
            if (!response.ok) {
                toast.error('Bad Response ' + JSON.stringify({ message: response.statusText, statusCode: response.status }), { position: 'top-left' });
                throw new Error({ message: response.statusText, statusCode: response.status });
            }
            responseData = await response.json();
            if(responseData == null) {
                throw 'Invalid Credentials - User Not Found'
            }
            const headers = {
                'x-ms-user-info': JSON.stringify({
                    id: responseData.id,
                    name: responseData.name
                })
    
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

    return (
        <div id='authForm' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
            {
                isSignIn &&
                <div>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSignInSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={signInUsername}
                            onChange={(e) => setSignInUsername(e.target.value)}
                            style={{ marginBottom: '10px', padding: '10px', width: '16rem' }} // 1 rem = 16px
                        />
                        <br />
                        <input
                            type="email"
                            placeholder="Password (mailId)"
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                            style={{ marginBottom: '10px', padding: '10px', width: '16rem' }}
                        />
                        <br />
                        <button type="submit" style={{ padding: '12px 10px', background: 'lightblue', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '8rem' }}>Sign In</button>
                        <h4>Click here to <a href='#' style={{ textDecoration: 'none' }} onClick={() => { setIsSignUp(true); setIsSignIn(false) }}>Signup</a> if new user</h4>

                    </form>
                    <ToastContainer />

                </div>
            }

            {isSignUp &&
                <div style={{ display: 'inline-block' }}>
                    <h1>Sign Up</h1>
                    <form onSubmit={handleSignUpSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={signUpUsername}
                            onChange={(e) => setSignUpUsername(e.target.value)}
                            style={{ marginBottom: '10px', padding: '10px', width: '16rem' }}
                        />
                        <br />
                        <input
                            type="mail"
                            placeholder="Password (mail)"
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            style={{ marginBottom: '10px', padding: '10px', width: '16rem' }}
                        />
                        <br />
                        <button type="submit" style={{ padding: '12px 10px', background: 'lightgreen', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '8rem' }}>Sign Up</button>
                        <h4>Click here to <a href='#' style={{ textDecoration: 'none' }} onClick={() => { setIsSignIn(true); setIsSignUp(false) }}>Login</a></h4>
                    </form>
                    <ToastContainer />
                </div>
            }
        </div>
    );
};

export default AuthComponent;
