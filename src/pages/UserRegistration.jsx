import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './UserRegistration.module.css';
import FormControl from '../components/FormControl';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

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
  const API_URL = 'http://localhost:3000/v1/api/users';
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
        setSuccess(response.data.message);
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
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          'An error occurred while registering the user.'
      );
    } finally {
      setIsLoading(false); // Set isLoading to false after the request is done
    }
  };
  return (
    <div className={style.container}>
      {isLoading && <Spinner />}
      {error && <div className={style['toast-error']}>{error}</div>}
      {success && <div className={style['toast-success']}>{success}</div>}
      <form onSubmit={handleFormSubmit} className={style['form']}>
        <div>
          <img
            src={imagePreviewUrl}
            alt='Chosen Image'
            className={style['responsive-image']}
          />
          <FormControl
            label='Image'
            type='file'
            id={'image'}
            name={'image'}
            change={handleImageChange}
          />
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
    </div>
  );
}

export default UserRegistration;
