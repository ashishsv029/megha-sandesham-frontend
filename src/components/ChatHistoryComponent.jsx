import ChatRoomsComponent from './ChatRoomsComponent';
import NewChatComponent from './NewChatComponent';
import UserProfileComponent from './UserProfileComponent';
let ChatHistoryComponent = ({loggedInUserInfo = {}, onRoomClick, associatedRooms = [], addNewRoom}) => {
  
  return (
   
    <>
      <UserProfileComponent userName={loggedInUserInfo.name} userProfileImage={loggedInUserInfo.profile_pic}/>
      <ChatRoomsComponent userInfo={loggedInUserInfo} roomsInfo={associatedRooms} onRoomClick={onRoomClick}/>
      <NewChatComponent userInfo={loggedInUserInfo} addNewRoom={addNewRoom} roomsInfo={associatedRooms} onRoomClick={onRoomClick}/>

      

    </>);
}

export default ChatHistoryComponent;