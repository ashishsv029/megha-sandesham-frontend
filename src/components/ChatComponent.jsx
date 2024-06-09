import { useState } from "react";
import RoomMessagesComponent from "./RoomMessagesComponent";
import RoomProfileComponent from "./RoomProfileComponent";
import SendMessageComponent from "./SendMessageComponent";
import BrandComponent from "./BrandComponent";
let ChatComponent = ({isUserSelectedAnyRoom, roomInfo, userSocket, selectedRoomMessages}) => {
   
    return (
        <>
            {
                isUserSelectedAnyRoom ? 
                <> 
                    <RoomProfileComponent RoomName={roomInfo.name} RoomProfileImage={
                        roomInfo?.associatedUsers?.filter(user => {if(user.name == roomInfo.name) {return user.profile_pic}})[0].profile_pic // can be optimized in backend
                        }/>
                    <RoomMessagesComponent roomMessages={selectedRoomMessages} />
                    <SendMessageComponent userSocket={userSocket} roomInfo={roomInfo}/>
                </> :
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: 'white', height: '100%' }}> 
                    <BrandComponent />
                </div>
            }

        </>
    );
}

export default ChatComponent;