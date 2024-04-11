// const RoomProfileComponent = () => {
//     return (
//         <div style={{flexGrow: 0, height: '10%', backgroundColor: '#c9cfcb'}}>
//             <h1>Room Profile Bar</h1>
//         </div>
//     )
// }

// export default RoomProfileComponent;

import { IoMdSettings } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa6";
const RoomProfileComponent = ({ RoomProfileImage = 'ntr.png', RoomName = 'NTR Jr' }) => {
    const profileBarStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgb(216 218 255)',
        flexGrow: 0,
        height: '10%',
        border: '0.5px solid #7a7a7a',
        borderRadius: '20px',
        margin: '10px',
        marginBottom: '0px'
    };

    const profileImgStyle = {
        height: '60%',
        borderRadius: '50%',
        padding: '6px',
        width: '6%',
        margin: '10px',
        flexGrow: 0,

    };

    const settingsIconStyle = {
        cursor: 'pointer',
        flexGrow: 0,
        width: '12%',
        height: '100%',
        padding: '1rem',
        marginLeft: '10px'

    };

    const openSettings = () => {
        // Functionality to open settings
        console.log('Settings clicked');
    };

    return (
        <div style={profileBarStyle}>
            <img src={RoomProfileImage} alt="Profile" style={profileImgStyle} />
            <span style={{ fontSize: '30px', fontWeight: '' }}>{RoomName}</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height:'100%', border: '0.5px solid #7a7a7a', width:'20%'}}>
                <FaSearch style={settingsIconStyle} onClick={() => openSettings()} />
                <hr/>
                <IoMdSettings style={settingsIconStyle} onClick={() => openSettings()} />
                <hr/>
                <FaPowerOff style={settingsIconStyle} onClick={() => openSettings()} />
                <hr/>
            </div>

        </div>
    );
}

export default RoomProfileComponent;