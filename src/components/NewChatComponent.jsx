import React, { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const NewChatComponent = ({ addNewRoom, userInfo, roomsInfo, onRoomClick}) => {

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        //onSearch(searchTerm);
        console.log('buttin clicked')
    };

    const createTempRoom = async (event) => {
        if (event.key === 'Enter') {
            // call get receiver details API
            setSearchTerm('');
            let receiverName = event.target.value;
            // if receiver name already in associated rooms, show it as if user clicked it
            let isUserAlreadyInRoomsList = roomsInfo.find(room => room.name === receiverName);
            if (isUserAlreadyInRoomsList) {
                onRoomClick(isUserAlreadyInRoomsList);
                return;
            }
            const response = await fetch(`http://localhost:3100/user/${receiverName}`);
            if (!response.ok) {
                toast.error('Bad Response ' + JSON.stringify({ message: response.statusText, statusCode: response.status }), { position: 'top-left' });
                return;
            }
            let responseData = await response.json();
            if (responseData == null) {
                toast.error('User Not Found ', { position: 'top-left' });
                return;
            }


            const tempRoomPayload = {
                id: responseData.id,
                name: responseData.name,
                type: "dm",
                admin: userInfo.id,
                min_participants: 1,
                max_participants: 2,
                is_private: true,
                is_temp_room: true,
                created_at: new Date().toISOString(),
                modified_at: new Date().toISOString()
            }
            addNewRoom(tempRoomPayload);


        }
    }

    return (
        <div style={{ flexGrow: 0, height: '6%', backgroundColor: '#c9cfcb', display: 'flex', margin: '10px' }}>
            <input
                type="text"
                placeholder="Chat With New User"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={createTempRoom}
                style={{
                    border: '0.5px solid #7a7a7a',
                    borderRadius: '20px',
                    width: '100%',
                    fontSize: '1.2rem',
                    padding: '0.8rem',
                    outline: 'None'
                }}
            />
            <button style={{ flexGrow: 0, width: '15%', borderRadius: '20px', backgroundColor: 'lightBlue', border: '1px solid black', marginLeft: '5px' }} onClick={handleSearchClick}>
                <IoIosSearch size={25} style={{ color: 'black' }} />
            </button>
            <button style={{ flexGrow: 0, width: '15%', borderRadius: '20px', backgroundColor: 'lightBlue', border: '1px solid black', marginLeft: '5px' }} onClick={handleSearchClick}>
                <AiOutlineUsergroupAdd size={25} style={{ color: 'black' }} />
            </button>
            <ToastContainer />
        </div>
    );
}

export default NewChatComponent;