import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../middleware/AuthContext';
import FormControl from '../components/FormControl';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import styles from './Login.module.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Login = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  const { login, isAuthenticated } = useContext(AuthContext); // Use login from AuthContext
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL + '/auth/login';

  const validateStudentNumber = (studentNumber) => {
    const studentNumberRegex = /^[a-zA-Z0-9]+$/;
    if (!studentNumberRegex.test(studentNumber)) {
      setError('Student number must only contain letters and numbers.');
      return false;
    }
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    return true;
  };

  const handleStudentNumberChange = (e) => {
    setStudentNumber(e.target.value);
    validateStudentNumber(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
  };

  useEffect(() => {
    {
      isAuthenticated && navigateTo('/profile');
    }
  }, [isAuthenticated, navigateTo]); // Redirect to profile if authenticated

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateStudentNumber(studentNumber) || !validatePassword(password)) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        studentNumber,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem('x-auth-token', token);
        login(user); // Use login function from AuthContext
      } else {
        setError('An error occurred while logging in. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setError(
          error.response?.data?.message || 'An error occurred while logging in.'
        );
      } else if (error.request) {
        setError(
          'Unable to connect to the server. Please check your internet connection and try again.'
        );
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container}`}>
      <h1 className='main-title'>Imahe</h1>
      <Helmet>
        <title>Imahe | Login</title>
      </Helmet>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <form className={`${styles.form}`} onSubmit={handleLogin}>
            <div className={styles['text-center']}>
              {error && <p className={styles['text-danger']}>{error}</p>}
            </div>
            <FormControl
              label='Student Number'
              id='studentNumber'
              type='text'
              value={studentNumber}
              change={handleStudentNumberChange}
            />
            <FormControl
              label='Password'
              id='password'
              type='password'
              value={password}
              change={handlePasswordChange}
            />

            <Button
              text='Login'
              click={handleLogin}
              size={'btn-block'}
              color={'btn-primary'}
            />
          </form>
          <span>
            Not yet registered?
            <span className={styles['link-to']}>
              <Link to='/register'> Register</Link>
            </span>
          </span>
        </>
      )}
    </div>
  );
};

export default Login;
