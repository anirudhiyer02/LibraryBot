import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({setUserCredentials}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      // Simulate a login process (could include API call)
      if (email && password) {
        // Store the user's credentials (e.g., in parent state or context)
        setUserCredentials({ email, password });

        // Navigate to the dashboard
        navigate('/dashboard');
      } else {
        alert('Please enter both email and password.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to login.');
    }
  };
  // const handleLogin = async () => {
  //   try {
  //     // Send credentials to the backend
  //     await axios.post('http://localhost:5000/run-bot', { email, password });
  //     alert('Credentials sent to the bot!');
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('Failed to send credentials.');
  //   }
  // };

  return (
    <div>
      <h1>Login Page</h1>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '10px', padding: '10px', fontSize: '16px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '10px', padding: '10px', fontSize: '16px' }}
        />
        <button onClick={handleLogin} style={{ padding: '10px', fontSize: '16px' }}>
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
