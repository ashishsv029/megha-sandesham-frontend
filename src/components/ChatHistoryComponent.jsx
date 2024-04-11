import ChatRoomsComponent from './ChatRoomsComponent';
import NewChatComponent from './NewChatComponent';
import UserProfileComponent from './UserProfileComponent';
let ChatHistoryComponent = ({loggedInUserInfo = {}, onRoomClick}) => {
  
  return (
   
    <>
      <UserProfileComponent userName={loggedInUserInfo.name}/>
      <ChatRoomsComponent userInfo={loggedInUserInfo} rooms={loggedInUserInfo.associatedRooms} onRoomClick={onRoomClick}/>
      <NewChatComponent/>

      

    </>);
}

export default ChatHistoryComponent;