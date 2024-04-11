import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { IoCheckmarkOutline } from "react-icons/io5";
const RoomMessagesComponent = ({ roomMessages = [{
    text: 'Hi Anna, how are you',
    isSenderMessage: true,
    time: '26 July 10:40',
    status: 'delivered'
}, {
    text: 'Hi broo, wassup...',
    isSenderMessage: false,
    time: '26 July 10:45',
    status: 'sent'
}] }) => {
    const receiverMessageStyle = {
        listStyle: 'none',
        padding: '12px 12px',
        margin: '12px',
        maxWidth: '50%',
        fontSize: '18px',
        wordWrap: 'break-word',
        borderRadius: '20px 20px 20px 0px',
        alignSelf: 'flex-start',
        backgroundColor: '#d9fdd3',
        boxShadow: '-2px 2px 4px #dcdcdc'
    }

    const senderMessageStyle = {
        listStyle: 'none',
        padding: '12px 12px',
        margin: '12px',
        maxWidth: '50%',
        fontSize: '18px',
        wordWrap: 'break-word',
        borderRadius: '20px 20px 0px 20px',
        alignSelf: 'flex-end',
        backgroundColor: '#d9fdd3',
        boxShadow: '2px 2px 4px #dcdcdc',


    }
    return (
        <div style={{ flexGrow: 0, height: '90%', backgroundColor: '#efe9e0', margin: '10px', marginBottom: '0px', border: '0.5px solid #7a7a7a', borderRadius: '20px 20px 0px 0px' }}>
            <ul class="message-container" id="message-container" style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    height: '100%',
                    
                }}>
                {roomMessages.map((message, index) => (
                    <li
                        key={index}
                        style={
                            message.isSenderMessage
                                ? senderMessageStyle
                                : receiverMessageStyle
                        }
                    >
                            {message.text}
                            <span style={{
                                display: 'block',
                                fontStyle: 'italic',
                                fontSize: '12px',
                                marginTop: '8px',
                                textAlign: 'right'
                            }}>{message.time}
                            <span style={{marginLeft: '10px'}}>{message.status == 'delivered' ? <IoCheckmarkDoneOutline size={20}/> : <IoCheckmarkOutline size={20}/>}</span>
                            </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RoomMessagesComponent;