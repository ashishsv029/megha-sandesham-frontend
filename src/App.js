import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Switch, Link, Navigate } from 'react-router-dom';
import BaseComponent from './components/BaseComponent';
import AuthComponent from './components/AuthComponent';
import BrandComponent from './components/BrandComponent';
import ChatHistoryComponent from './components/ChatHistoryComponent';
import ChatComponent from './components/ChatComponent';
import { useState, useRef } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserInfo, setLoggedInUserInfo] = useState(undefined);
  const [isUserSelectedAnyRoom, setIsUserSelectedAnyRoom] = useState(false);
  const [selectedRoomInfo, setSelectedRoomInfo] = useState(undefined);
  const [selectedRoomMessages, setSelectedRoomMessages] = useState([]);
  const [associatedRooms, setAssociatedRooms] = useState([])
  const [userSocket, setUserSocket] = useState(undefined);
  //const userSocket = useRef(undefined);
  let loggedInUser = useRef(undefined); // better to use useRef to hold this variable's value across rerenders, local value might reset when this app component itself renrenders
  //let selectedRoomRef = useRef(undefined); // better to use useRef to hold this variable
  const onRoomClick = async (roomInfo) => {
    console.log('clicked room = ', roomInfo)
    setIsUserSelectedAnyRoom(true);
    setSelectedRoomInfo(roomInfo);
    //selectedRoomRef.current = roomInfo;
    // make api call to fetch room messages and set state
    try {
      const response = await fetch(`http://localhost:3100/room/${roomInfo.id}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-ms-user-info': JSON.stringify({
            id: loggedInUser.current.id,
            name: loggedInUser.current.name
          })
        }
      });
      if (!response.ok) {
        console.log("some thing went wrong while fetching messages");
        return;
      }
      let messages = await response.json();
      console.log("Messages of the room:-", messages)
      setSelectedRoomMessages(messages);
    } catch (error) {
      console.error('Error:', error);
      // toast.error('Login failed' + error, { position: 'top-left' }); // Display error toast
      //throw error;
    }
  }

  const modifyLoggedInStatus = (status) => {
    setIsLoggedIn(true);
  }

  const setUserInfoOnAppContext = (userInfo, socket) => {
    //iterte on associated rooms and for all dm rooms change the room name to respective user name and set it in state
    userInfo?.associatedRooms?.forEach((room) => {
      if (room.type == 'dm')
        room.name = room.admin == userInfo.id ? room.name.split(':')[1] : room.name.split(':')[0]
    })
    loggedInUser.current = userInfo;
    //userSocket.current = socket;
    setUserSocket(socket);
    setLoggedInUserInfo(userInfo);
    setAssociatedRooms(userInfo.associatedRooms);
  }

  const addNewRoomIntoAssociatedRooms = (room) => {
    if (room.type == 'dm')
      room.name = room.admin == loggedInUser.current.id ? room.name.split(':')[1] : room.name.split(':')[0]
    console.log('state value=' + loggedInUser.current.id);
    setAssociatedRooms(prevRooms => prevRooms.concat(room)); //USING functional form of setState instead if directly concating room with assoicated rooms dont do
  }

  const addNewMessageIntoCurrentRoom = (message) => {
    message.isUserMessage = message.fromUser.id == loggedInUser.current.id ? true : false;
    setSelectedRoomMessages(prevMessages => prevMessages.concat(message))
  }

  return (

    <Router>
      <Routes>
        {/* have a default header component if needed */}
        <Route exact path="/" element={isLoggedIn ? <Navigate to="/chat" replace /> : <Navigate to="/auth" replace />} />
        <Route exact path="/auth" element={
          <BaseComponent leftChildComponent={
            <AuthComponent modifyLoggedInStatus={modifyLoggedInStatus} setUserInfoOnAppContext={setUserInfoOnAppContext} addNewRoomIntoAssociatedRooms={addNewRoomIntoAssociatedRooms} addNewMessageIntoCurrentRoom={addNewMessageIntoCurrentRoom} />}
            rightChildComponent={
              <BrandComponent />}
            leftChildStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '30%', backgroundColor: '#c9cfcb' }}
            rightChildStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '70%', backgroundColor: 'black' }}
          />
        }
        />
        <Route exact path="/chat" element={
          isLoggedIn ?
            <BaseComponent leftChildComponent={
              <ChatHistoryComponent loggedInUserInfo={loggedInUserInfo} onRoomClick={onRoomClick} associatedRooms={associatedRooms} />}
              rightChildComponent={<ChatComponent isUserSelectedAnyRoom={isUserSelectedAnyRoom} roomInfo={selectedRoomInfo} userSocket={userSocket} selectedRoomMessages={selectedRoomMessages} />}
              leftChildStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '30%', backgroundColor: '#c9cfcb' }}
              rightChildStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '70%', backgroundColor: '#c9cfcb' }}
            />
            : <Navigate to='/auth' />
        }
        />
      </Routes>
    </Router>
  );
}

export default App;