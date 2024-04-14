import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { MdScheduleSend } from "react-icons/md";
import ScheduleComponent from './ScheduleComponent';
const SendMessageComponent = ({ userSocket, roomInfo }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [schedulingDisplayStatus, setSchedulingDisplayStatus] = useState(false);
    const [messageDeliveryScheduledTime, setMessageDeliveryScheduledTime] = useState('');
    const [messageDeliveryScheduledDate, setMessageDeliveryScheduledDate] = useState('');



    const handleSearchChange = (event) => {
        event.preventDefault()

        setSearchTerm(event.target.value);
    };

    const sendMessage = (event) => {
        if (event.key === 'Enter') {
            //if schedule details are set, send those details also in payload
            let scheduledTimestamp;
            let messagePayload = {
                message: event.target.value,
                time: new Date().toISOString(),
                room_id: roomInfo.id
            }
            if(messageDeliveryScheduledDate != '') {
                if(messageDeliveryScheduledTime == '') {
                    setMessageDeliveryScheduledTime("12:00 AM"); //defaulting time slot to 12 AM
                }
                scheduledTimestamp = getScheduledTimeInISOStringFormat(messageDeliveryScheduledDate, messageDeliveryScheduledTime);
                messagePayload.scheduled_time = scheduledTimestamp
            }
            //console.log('schedule details', getScheduledTimeInISOStringFormat(messageDeliveryScheduledDate, messageDeliveryScheduledTime))
            
            if(roomInfo.is_temp_room) {
                messagePayload.is_new_dm = true;
                messagePayload.receiver_name = roomInfo.name
            }
            userSocket.emit('chat-message', messagePayload);
            setSearchTerm('');
            return;
        }
    }

    const handleMessageSchedule = () => {
        console.log('handler', schedulingDisplayStatus)
        setSchedulingDisplayStatus((prevState) => !prevState)
        setMessageDeliveryScheduledDate('');
        setMessageDeliveryScheduledTime('');
    }


    const handleSearchClick = () => {
        //onSearch(searchTerm);

    };

    const getScheduledTimeInISOStringFormat = (date, timeSlot) => {
        console.log('date- ', date, 'timeSlot- ', timeSlot)
        const [year, month, day] = date.split('-').map(Number);
        // Split time slot into hours and minutes
        const [time, period] = timeSlot.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        // Convert hours to 24-hour format if it's PM
        const formattedHours = period === 'PM' ? hours + 12 : hours;
        // Create a new Date object with the combined date and time
        const dateTime = new Date(year, month - 1, day, formattedHours, minutes);
        // return ISO string
        return dateTime.toISOString();
      }
    
    const updateMessageDeliverySchedule = (scheduledTimeInISOStringFormat) =>{
    
    }

    const updateScheduleDate = (date)=>{
        setMessageDeliveryScheduledDate(date);
    }

    const updateScheduleTime = (time)=>{
        setMessageDeliveryScheduledTime(time);
    }

    return (
        <div style={{ flexGrow: 0, height: '6%', display: 'flex', margin: '10px', marginTop: '0px' }}>
            <button style={{ flexGrow: 0, width: '5%', borderRadius: '20px', backgroundColor: 'lightBlue', border: '1px solid black', marginTop: '0.3rem' }} onClick={handleSearchClick}>
                <FaPlus size={25} style={{ width: '20px',color: 'black' }} />
            </button>
            <button style={{ flexGrow: 0, width: '5%', borderRadius: '20px', backgroundColor: 'lightBlue', border: '1px solid black', marginTop: '0.3rem', marginLeft: '0.5rem' }}  onClick={handleMessageSchedule}>
                <MdScheduleSend size={25} style={{ width: '20px',color: 'black' }} />
            </button>
            <div style={{ display: schedulingDisplayStatus ? 'block' : 'none', flexGrow: 0, width: '30%', borderRadius: '20px' }} >
                <ScheduleComponent updateScheduleDate={updateScheduleDate} updateScheduleTime={updateScheduleTime} initDate={messageDeliveryScheduledDate} initTime={messageDeliveryScheduledTime}/>
            </div>
            <input
                type="text"
                placeholder="Click Enter to Send Message..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={sendMessage}
                style={{
                    border: '0.5px solid #7a7a7a',
                    borderRadius: '0px 0px 20px 20px',
                    width: schedulingDisplayStatus ? '60%' : '90%',
                    fontSize: '1.2rem',
                    padding: '0.8rem',
                    outline: 'None',
                    marginLeft: '0.5rem'

                }}
            />
            
            
        </div>
    );
}

export default SendMessageComponent;