import { IoMdSettings } from "react-icons/io";
const UserProfileComponent = ({ userProfileImage = 'ashu.jpeg', userName }) => {
  const profileBarStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'lightBlue',//'#d2d8ff',
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
    width: '12%',
    margin: '10px',
    flexGrow: 0
  };

  const settingsIconStyle = {
    cursor: 'pointer',
    flexGrow: 0,
    width: '8%',
    height: '80%',
    padding: '10px',
  };

  const openSettings = () => {
    console.log('Settings clicked');
  };

  return (
    <div style={profileBarStyle}>
      <img src={userProfileImage} alt="Profile" style={profileImgStyle} />
      <span style={{ fontSize: '30px', fontWeight: '' }}>{userName}</span>
      <IoMdSettings style={settingsIconStyle} onClick={() => openSettings()} />
    </div>
  );
}

export default UserProfileComponent;