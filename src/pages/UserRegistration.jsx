import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './UserRegistration.module.css';
import FormControl from '../components/FormControl';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Dropzone from 'react-dropzone';
import { Link } from 'react-router-dom';

function UserRegistration() {
  const [form, setForm] = useState({
    image: null,
    email: '',
    studentNumber: '',
    name: '',
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // Add message state variable

  const API_URL =
    import.meta.env.VITE_REACT_APP_API_URL + '/users' ||
    'http://localhost:3000/v1/api/users';
  console.log(API_URL + '/users');
  const navigate = useNavigate();

  useEffect(() => {
    let url;
    if (form.image) {
      url = URL.createObjectURL(form.image);
      setImagePreviewUrl(url);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [form.image]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleImageChange = (event) => {
    setForm((prevState) => ({ ...prevState, image: event.target.files[0] }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Form validation
    if (!form.email || !form.studentNumber || !form.name || !form.image) {
      setError('Please fill out all fields.');
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    setIsLoading(true); // Set isLoading to true before making the request

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        // Check for status 200 or 201
        setMessage(response.data.message); // Set message on success
        setError('');
        setForm((prevState) => ({
          ...prevState,
          image: null,
          url: '',
          email: '',
          studentNumber: '',
          name: '',
        }));
        navigate('/register-success'); // Replace '/success' with the desired redirect path
      }
      console.log(response);
    } catch (error) {
      console.error(error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(
          error.response?.data?.message ||
            'An error occurred while registering. Please try again.'
        );
        console.log(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        setError('Network error. Please check try again later');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false); // Set isLoading to false after the request is done
    }
  };
  return (
    <div className={style.container}>
      {isLoading ? (
        <Spinner /> // Render Spinner when isLoading is true
      ) : error ? (
        <div className={style['toast-error']}>{error}</div> // Render error message when error is not null
      ) : message ? (
        <div className={style['toast-success']}>{message}</div> // Render success message when message is not null
      ) : null}
      <div className={style.container}>
        <form onSubmit={handleFormSubmit} className={style['form']}>
          <div>
            <img
              src={imagePreviewUrl || 'https://via.placeholder.com/400'}
              alt='Chosen Image'
              className={style['responsive-image']}
            />
            <FormControl type='file' change={handleImageChange} />
          </div>
          <div>
            <FormControl
              label='Email'
              type='email'
              id={'email'}
              name={'email'}
              value={form.email}
              change={handleInputChange}
            />
          </div>
          <div>
            <FormControl
              label='Student Number'
              type='text'
              name={'studentNumber'}
              id={'studentNumber'}
              value={form.studentNumber}
              change={handleInputChange}
            />
          </div>
          <FormControl
            label='Name'
            id={'name'}
            name={'name'}
            type='text'
            value={form.name}
            change={handleInputChange}
          />
          <div>
            <Button
              type='submit'
              text={'Register'}
              size={'btn-block'}
              color={'btn-primary'}
            />
          </div>
        </form>
        <span>
          Already Registered?
          <span className={style['link-to']}>
            <Link to='/login'>Login</Link>
          </span>
        </span>
      </div>
    </div>
  );
}

export default UserRegistration;
