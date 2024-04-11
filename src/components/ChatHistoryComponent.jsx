import ChatRoomsComponent from './ChatRoomsComponent';
import NewChatComponent from './NewChatComponent';
import UserProfileComponent from './UserProfileComponent';
let ChatHistoryComponent = ({loggedInUserInfo = {}, onRoomClick, associatedRooms = []}) => {
  
  return (
   
    <>
      <UserProfileComponent userName={loggedInUserInfo.name}/>
      <ChatRoomsComponent userInfo={loggedInUserInfo} roomsInfo={associatedRooms} onRoomClick={onRoomClick}/>
      <NewChatComponent/>

      

    </>);
}

export default ChatHistoryComponent;