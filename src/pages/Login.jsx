import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../middleware/AuthContext';

const Login = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigateTo = useNavigate();
  const { setIsAuthenticated, setUser } = useContext(AuthContext); // Use AuthContext
  const API_URL = 'http://localhost:3000/v1/api/auth/login';

  const handleLogin = async () => {
    try {
      // Make API request to authenticate user
      setLoading(true);
      const response = await axios.post(API_URL, {
        studentNumber,
        password,
      });

      if (response.status === 200) {
        const { authToken } = response.data.token;
        console.log(response);

        // Store auth token in session storage
        sessionStorage.setItem('authToken', authToken);

        // Store auth token in local storage
        localStorage.setItem('authToken', authToken);

        // Redirect to profile page
        navigateTo('/profile');

        setSuccess(true);
        // After a successful login, update the isAuthenticated and user states
        setIsAuthenticated(true);
        setUser(response.data.user); // Set user to the authenticated user
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      // Handle login error
      console.log(error);
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {success && <p>Login successful</p>}
      <input
        type='text'
        placeholder='Student Number'
        value={studentNumber}
        onChange={(e) => setStudentNumber(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
