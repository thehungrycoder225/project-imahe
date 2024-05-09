import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../middleware/AuthContext';
import FormControl from '../components/FormControl';
import Button from '../components/Button';
import styles from './Login.module.css';

const Login = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext); // Use login from AuthContext
  const API_URL = 'http://localhost:3000/v1/api/auth/login';

  useEffect(() => {
    {
      isAuthenticated && navigateTo('/profile');
    }
  }, [isAuthenticated, navigateTo]); // Redirect to profile if authenticated

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        studentNumber,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        sessionStorage.setItem('x-auth-token', token);
        localStorage.setItem('x-auth-token', token);
        login(user); // Use login function from AuthContext
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container}`}>
      <h1 className='main-title'>Imahe</h1>
      <form
        className={`${styles.form}`}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && <p>Loading...</p>}
        <FormControl
          label='Student Number'
          id='studentNumber'
          type='text'
          value={studentNumber}
          change={(e) => setStudentNumber(e.target.value)}
        />
        <FormControl
          label='Password'
          id='password'
          type='password'
          value={password}
          change={(e) => setPassword(e.target.value)}
        />

        <Button
          text='Login'
          click={handleLogin}
          size={'btn-block'}
          color={'btn-primary'}
        />
      </form>
    </div>
  );
};

export default Login;
