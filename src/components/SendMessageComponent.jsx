import React, { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
const SendMessageComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        //onSearch(searchTerm);
    };

    return (
        <div style={{ flexGrow: 0, height: '6%', display: 'flex' , margin: '10px', marginTop: '0px' }}>
            <input
                type="text"
                placeholder="Click Enter to Send Message..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                    border: '0.5px solid #7a7a7a',
                    borderRadius: '0px 0px 20px 20px', 
                    width: '100%',
                    fontSize: '1.2rem',
                    padding:'0.8rem',
                    outline: 'None'

                }}
            />
            {/* <button style={{ flexGrow: 0, width: '15%', borderRadius: '20px', backgroundColor: 'lightBlue', border: '3px solid black' }} onClick={handleSearchClick}>
                <IoIosSearch style={{ width: '20px',color: 'black' }} />
            </button> */}
        </div>
    );
}

export default SendMessageComponent;