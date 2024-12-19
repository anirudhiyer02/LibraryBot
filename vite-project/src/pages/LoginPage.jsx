import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Send credentials to the backend
      await axios.post('http://localhost:5000/run-bot', { email, password });
      alert('Credentials sent to the bot!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send credentials.');
    }
  };

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
