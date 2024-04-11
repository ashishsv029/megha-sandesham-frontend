import React, { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
const NewChatComponent = () => {

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        //onSearch(searchTerm);
        console.log('buttin clicked')
    };

    return (
        <div style={{ flexGrow: 0, height: '6%', backgroundColor: '#c9cfcb', display: 'flex' , margin: '10px'  }}>
            <input
                type="text"
                placeholder="Chat With New User"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                    border: '0.5px solid #7a7a7a',
                    borderRadius: '20px', 
                    width: '100%',
                    fontSize: '1.2rem',
                    padding:'0.8rem',
                    outline: 'None'
                }}
            />
            <button style={{ flexGrow: 0, width: '15%', borderRadius: '20px', backgroundColor: 'lightBlue', border: '1px solid black', marginLeft: '5px' }} onClick={handleSearchClick}>
                <IoIosSearch size={25} style={{color: 'black' }} />
            </button>
            <button style={{ flexGrow: 0, width: '15%', borderRadius: '20px', backgroundColor: 'lightBlue', border: '1px solid black' , marginLeft: '5px' }} onClick={handleSearchClick}>
                <AiOutlineUsergroupAdd size={25} style={{ color: 'black' }} />
            </button>
        </div>
    );
}

export default NewChatComponent;