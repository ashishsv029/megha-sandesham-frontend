import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Switch, Link, Navigate } from 'react-router-dom';
import BaseComponent from './components/BaseComponent';
import AuthComponent from './components/AuthComponent';
import BrandComponent from './components/BrandComponent';
import ChatHistoryComponent from './components/ChatHistoryComponent';
import ChatComponent from './components/ChatComponent';
import { useState } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserInfo, setLoggedInUserInfo] = useState(undefined);
  const [isUserSelectedAnyRoom, setIsUserSelectedAnyRoom] = useState(false);
  const [selectedRoomInfo, setSelectedRoomInfo] = useState(undefined);
  const onRoomClick = (roomInfo) =>{
      console.log('clicked room = ' ,roomInfo)
      setIsUserSelectedAnyRoom(true);
      setSelectedRoomInfo(roomInfo);
  }
  const modifyLoggedInStatus = (status) => {
    setIsLoggedIn(true);
  }
  const setUserInfoOnAppContext = (userInfo) => {
    //iterte on associated rooms and for all dm rooms change the room name to respective user name and set it in state
    userInfo?.associatedRooms?.forEach((room) => {
      if(room.type == 'dm')
          room.name = room.admin == userInfo.id ? room.name.split(':')[1] : room.name.split(':')[0]
    })
    setLoggedInUserInfo(userInfo);
  }
  return (
      
      <Router>
      <Routes>
        {/* have a default header component if needed */}
        <Route exact path="/" element={isLoggedIn ? <Navigate to="/chat" replace /> : <Navigate to="/auth" replace /> }/>
        <Route exact path="/auth" element={
              <BaseComponent  leftChildComponent={
                                  <AuthComponent modifyLoggedInStatus = {modifyLoggedInStatus} setUserInfoOnAppContext = {setUserInfoOnAppContext}/>} 
                              rightChildComponent={
                                  <BrandComponent/>} 
                              leftChildStyle={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '30%', backgroundColor: '#c9cfcb' }}
                              rightChildStyle={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '70%', backgroundColor: 'black' }}
              />
            }
        />
        <Route exact path="/chat" element= {  
                isLoggedIn ? 
                <BaseComponent  leftChildComponent={
                                  <ChatHistoryComponent loggedInUserInfo = {loggedInUserInfo} onRoomClick={onRoomClick}/>} 
                                rightChildComponent={<ChatComponent isUserSelectedAnyRoom={isUserSelectedAnyRoom} roomInfo = {selectedRoomInfo}/>} 
                                leftChildStyle={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '30%', backgroundColor: '#c9cfcb' }}
                                rightChildStyle={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '70%', backgroundColor: '#c9cfcb' }}
                /> 
                : <Navigate to='/auth'/>
              }
        />
      </Routes>
    </Router>
  );
}

export default App;