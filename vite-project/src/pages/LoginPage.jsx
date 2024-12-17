import React, { useState } from 'react';
import axios from 'axios';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the backend to trigger the bot
      await axios.post('http://localhost:5000/run-bot');
      alert('Bot launched successfully!');
    } catch (error) {
        console.error('Error launching bot:', error);
  
        // More comprehensive error alert
        if (error.response) {
          // Server responded with a status code other than 2xx
          alert(`Failed to launch bot. Server Error: ${error.response.data || error.response.statusText}`);
        } else if (error.request) {
          // Request was made but no response received
          alert('Failed to launch bot. No response from the server. Please check if the backend is running.');
        } else {
          // Other errors (e.g., network issues)
          alert(`Failed to launch bot. Error: ${error.message}`);
        }
      }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
