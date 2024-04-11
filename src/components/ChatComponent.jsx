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
                    <RoomProfileComponent RoomName={roomInfo.name}/>
                    <RoomMessagesComponent roomMessages={selectedRoomMessages} />
                    <SendMessageComponent userSocket={userSocket} roomInfo={roomInfo}/>
                </> :
                <div style={{ height: '100%', backgroundColor: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}> 
                    <BrandComponent />
                </div>
            }

        </>
    );
}

export default ChatComponent;