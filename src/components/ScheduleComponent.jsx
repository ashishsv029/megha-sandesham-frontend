import React, { useState, useEffect } from 'react';

const ScheduleComponent = ({updateScheduleDate, updateScheduleTime, initDate, initTime}) => {
  const [date, setDate] = useState(initDate);
  const [timeSlot, setTimeSlot] = useState(initTime);

  // update state to rerender when the prop changes

  useEffect(() => {
    setDate(initDate);
  }, [initDate]); 

  useEffect(() => {
    setTimeSlot(initTime);
  }, [initTime]); 


  const handleDateChange = (e) => {
    setDate(e.target.value);
    updateScheduleDate(e.target.value)

  };

  const handleTimeSlotChange = (e) => {
    setTimeSlot(e.target.value);
    updateScheduleTime(e.target.value)
  };

  const currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Get current date in "YYYY-MM-DD" format

  return (
    <div style={{ display:'flex', flexDirection: 'column', border: '5px solid #ccc', borderRadius: '5px'}}>
      <input 
          id="date"
          type="date" 
          value={date} 
          onChange={handleDateChange} 
          min={currentDate}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', height: '50%' }}
        />
    
        <select 
          id="timeSlot"
          value={timeSlot} 
          onChange={handleTimeSlotChange}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' , height: '51.5%' }}
        >
          <option value="">Select Msg Delivery Time Slot...</option>
          <option value="07:00 AM">07:00 AM</option>
          <option value="08:00 AM">08:00 AM</option>
          <option value="09:00 AM">09:00 AM</option>
          <option value="10:00 AM">10:00 AM</option>
          <option value="11:00 AM">11:00 AM</option>
          <option value="12:00 PM">12:00 PM</option>
          <option value="01:00 PM">1:00 PM</option>
          <option value="02:00 PM">2:00 PM</option>
          <option value="03:00 PM">3:00 PM</option>
          <option value="04:00 PM">4:00 PM</option>
          <option value="05:00 PM">5:00 PM</option>
          <option value="06:00 PM">6:00 PM</option>
          <option value="07:00 PM">7:00 PM</option>
          <option value="08:00 PM">8:00 PM</option>
          <option value="09:00 PM">9:00 PM</option>
          <option value="10:00 PM">10:00 PM</option>
          <option value="11:00 PM">11:00 PM</option>
          <option value="12:00 AM">12:00 AM</option>
          <option value="01:00 AM">01:00 AM</option>
          <option value="02:00 AM">02:00 AM</option>
          <option value="03:00 AM">03:00 AM</option>
          <option value="04:00 AM">04:00 AM</option>
          <option value="05:00 AM">05:00 AM</option>
          <option value="06:00 AM">06:00 AM</option>

        </select>
   
    </div>
  );
};

export default ScheduleComponent;
