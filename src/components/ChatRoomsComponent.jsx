const ChatRoomsComponent = ({ rooms = [{
    photo: 'ntr.png',
    name: "NTR Jr"
}, {
    photo: 'ntr.png',
    name: "NTR Jr"
}], onRoomClick, userInfo }) => {
    
    return (
        <div style={{ flexGrow: 0, height: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', border: '0.5px solid #7a7a7a', borderRadius: '20px' , padding: '1rem', margin: '10px', marginBottom: '0px'}}>
            {rooms.map((room, index) => (
                <div
                    key={index}
                    style={{
                        border: '1px solid black',
                        borderRadius: '20px',
                        padding: '10px',
                        margin: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        
                    }}
                    onClick={() => onRoomClick(room)}
                >
                    <img src={room.photo ? room.photo : 'ntr.png'} alt="Item" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                    <span style={{marginLeft: '1rem'}}>
                        
                    {room.name}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default ChatRoomsComponent;