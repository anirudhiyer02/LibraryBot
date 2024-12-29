import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ userCredentials }) {
  const [bookingQueue, setBookingQueue] = useState([]);
  const [newBooking, setNewBooking] = useState({
    date: '',
    timeSlot: '',
    duration: '',
    room: '',
    category: '',
  });

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get-bookings/${userCredentials.email}`);
      setBookingQueue(response.data); // Populate the booking queue with the response
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to retrieve bookings.');
    }
  };

  // Fetch bookings when the component mounts
  useEffect(() => {
    fetchBookings();
  }, []); // Empty dependency array ensures this runs only once when the component loads


  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking((prevBooking) => ({ ...prevBooking, [name]: value }));
  };

  // Add a new booking to the queue
  const handleAddBooking = async () => {
    if (!newBooking.date || !newBooking.timeSlot || !newBooking.room || !newBooking.category||!newBooking.duration) {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      await axios.post('http://localhost:5000/add-booking', {
        email: userCredentials.email,
        ...newBooking,
      });
      setBookingQueue((prevQueue) => [
        ...prevQueue,
        { ...newBooking, email: userCredentials.email },
      ]);
  
      alert('Booking added to the queue!');
      setNewBooking({ date: '', timeSlot: '',duration: '', room: '', category: '' });
    } catch (error) {
      console.error('Error adding booking:', error);
      alert('Failed to add booking to the queue.');
    }
  };
  

  // Run the booking bot for the queued bookings
  const handleRunBookingBot = async () => {
    try {
      const response = await axios.post('http://localhost:5000/run-bot', {
        email: userCredentials.email,
        password: userCredentials.password,
        bookingQueue,
      });
      alert(`Booking bot started: ${response.data.message}`);
    } catch (error) {
      console.error('Error running booking bot:', error);
      alert('Failed to start the booking bot.');
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {userCredentials.email}!</p>
      <p>Schedule your room bookings below.</p>

      {/* Booking Form */}
      <div style={styles.form}>
        <h3>Add a New Booking</h3>
        <input
          type="date"
          name="date"
          value={newBooking.date}
          onChange={handleInputChange}
          style={styles.input}
          placeholder="Date"
        />
        <input
          type="time"
          name="timeSlot"
          value={newBooking.timeSlot}
          onChange={handleInputChange}
          style={styles.input}
          placeholder="Time Slot"
        />
        <input 
            type = "number"
            name = "duration"
            value = {newBooking.duration}
            onChange={handleInputChange}
            style = {styles.input}
            placeholder="Duration"
        />
        <input
          type="text"
          name="room"
          value={newBooking.room}
          onChange={handleInputChange}
          style={styles.input}
          placeholder="Room Number"
        />
        <input
          type="text"
          name="category"
          value={newBooking.category}
          onChange={handleInputChange}
          style={styles.input}
          placeholder="Category"
        />
        <button onClick={handleAddBooking} style={styles.button}>
          Add to Queue
        </button>
      </div>

      {/* Display Booking Queue */}
      <div style={styles.queue}>
        <h3>Booking Queue</h3>
        {bookingQueue.length === 0 ? (
          <p>No bookings in the queue.</p>
        ) : (
          <ul>
            {bookingQueue.map((booking, index) => (
              <li key={index}>
                {booking.date} - Time: {booking.timeSlot} - Duration: {booking.duration} - Room: {booking.room} - {booking.category}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Run Booking Bot */}
      <button onClick={handleRunBookingBot} style={styles.button}>
        Run Booking Bot
      </button>
    </div>
  );
}

const styles = {
  form: {
    marginBottom: '20px',
  },
  input: {
    display: 'block',
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    maxWidth: '300px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  queue: {
    marginTop: '20px',
  },
};

export default Dashboard;
