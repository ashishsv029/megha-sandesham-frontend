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

  const [isLoggedIn, setIsLoggedIn] = useState(false); // dont hardcode as false, chekc for auth cookie if exists set as true
  const [loggedInUserInfo, setLoggedInUserInfo] = useState(undefined);
  const [isUserSelectedAnyRoom, setIsUserSelectedAnyRoom] = useState(false);
  const [selectedRoomInfo, setSelectedRoomInfo] = useState(undefined);
  const [selectedRoomMessages, setSelectedRoomMessages] = useState([]);
  const [associatedRooms, setAssociatedRooms] = useState([])
  const [userSocket, setUserSocket] = useState(undefined);


  //const userSocket = useRef(undefined);
  let loggedInUser = useRef(undefined); // better to use useRef to hold this variable's value across rerenders, local value might reset when this app component itself renrenders
  let selectedRoomRef = useRef({}); // better to use useRef to hold this variable
  
  const onRoomClick = async (roomInfo) => {
    console.log('clicked room = ', roomInfo)
    setIsUserSelectedAnyRoom(true);
    selectedRoomRef.current = roomInfo;
    setSelectedRoomInfo(roomInfo);
    // make api call to fetch room messages and set state
    try {
      // local:- http://app:3100/room/${roomInfo.id}/messages
      const response = await fetch(`/room/${roomInfo.id}/messages`, {
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
    }
  }

  const modifyLoggedInStatus = (status) => {
    setIsLoggedIn(status);
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
    //update messages state only when the current room in which user is

    if (message.temp_room_id && message.fromUser.id == loggedInUser.current.id) { // This block of code updates the temp room info stored in sender side only
      console.log("selectedRoomRef.current=", selectedRoomRef.current);
      selectedRoomRef.current.id = message.deliverable_room_id;
      delete selectedRoomRef.current.is_temp_room;
      setSelectedRoomInfo(selectedRoomRef.current);
      // somhow the temp room in associated rooms array is also updated automatically as we want (check later)
    }
    if (message.deliverable_room_id == selectedRoomRef.current?.id) {
      message.isUserMessage = message.fromUser.id == loggedInUser.current.id ? true : false;
      setSelectedRoomMessages(prevMessages => prevMessages.concat(message))
    } else {
      //handle unseen messages count here...
    }

  }

  const addNewRoom = (tempRoom) => {
    setAssociatedRooms(prevRooms => prevRooms.concat(tempRoom)); //USING functional form of setState instead if directly concating room with assoicated rooms dont do
  }


  return (

    <Router>
      <Routes>
        {/* have a default header component if needed */}
        <Route exact path="/" element={isLoggedIn ? <Navigate to="/chat" replace /> : <Navigate to="/auth" replace />} />
        <Route exact path="/auth" element={
          <BaseComponent
            leftChildComponent={
              <AuthComponent modifyLoggedInStatus={modifyLoggedInStatus} setUserInfoOnAppContext={setUserInfoOnAppContext} addNewRoomIntoAssociatedRooms={addNewRoomIntoAssociatedRooms} addNewMessageIntoCurrentRoom={addNewMessageIntoCurrentRoom} />}
            rightChildComponent={
              <BrandComponent />}
            leftChildStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', width: '30%', backgroundColor: '#a9b4be' }}//rgb(0 139 209) #c9cfcb
            rightChildStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '70%', backgroundColor: 'white' }}
          />
        }
        />
        <Route exact path="/chat" element={
          isLoggedIn ?
            <BaseComponent
              leftChildComponent={
                <ChatHistoryComponent loggedInUserInfo={loggedInUserInfo} onRoomClick={onRoomClick} associatedRooms={associatedRooms} addNewRoom={addNewRoom} />}
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