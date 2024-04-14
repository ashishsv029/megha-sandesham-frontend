import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { IoCheckmarkOutline } from "react-icons/io5";
import { useState, useRef, useEffect } from 'react';

const RoomMessagesComponent = ({ roomMessages = []}) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        //Scroll to the bottom of the scrollable element when component mounts
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
              top: 50000000000, //given a max value whihc will be more than growable height of container
              behavior: 'smooth'
            });
          }
        
      }, [roomMessages]);
    
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
        <div ref={scrollRef}  style={{ flexGrow: 0, height: '90%', backgroundColor: '#efe9e0', margin: '10px', marginBottom: '0px', border: '0.5px solid #7a7a7a', borderRadius: '20px 20px 0px 0px',overflowY: 'scroll',
        overflowX: 'hidden' }}>
            <ul className="message-container" id="message-container" style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%'
                    
                }}>
                {roomMessages.map((message, index) => (
                    <li
                        key={index}
                        style={
                            message.isUserMessage
                                ? senderMessageStyle
                                : receiverMessageStyle
                        }
                    >
                       <span style={{
                                display: 'block', fontSize: '1.2rem', fontFamily: "Pacifico, cursive", color: message.isUserMessage?'blue':'green',marginBottom: '4px'}}>{message.fromUser.name}</span> 
                            {message.text}
                            <span style={{
                                display: 'block',
                                fontStyle: 'italic',
                                fontSize: '12px',
                                marginTop: '8px',
                                textAlign: 'right'
                            }}>{message.created_at}
                            <span style={{marginLeft: '10px'}}>{message.status == 'delivered' ? <IoCheckmarkDoneOutline size={20}/> : <IoCheckmarkOutline size={20}/>}</span>
                            </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RoomMessagesComponent;