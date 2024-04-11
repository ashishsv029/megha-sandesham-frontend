import React from 'react';

const BaseComponent = ({ leftChildComponent, rightChildComponent, leftChildStyle, rightChildStyle }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      height: '90vh', // 80% of the viewport height
      backgroundColor: 'red',
      display: 'flex',
      flexDirection: 'row', // stack child elements side by side
      justifyContent: 'flex-start', // so the child elements will be row wise kept from start of flex box (i.e from left)
      alignItems: 'stretch', // so the child elements will be stretched their height to flex box s height
    }}>
      {/* left child component */}
      {
        leftChildComponent &&
        <div style={leftChildStyle}>
          {leftChildComponent}
          
        </div>
      }
      {/* right child component */}
      {
        rightChildComponent &&
        <div style={rightChildStyle}>
          {rightChildComponent}
        </div>
      }

    </div>
  );
};

export default BaseComponent;
