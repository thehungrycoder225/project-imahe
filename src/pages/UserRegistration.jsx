import { useState } from 'react';
import axios from 'axios';
import style from './UserRegistration.module.css';

function UserRegistration() {
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const API_URL = 'http://localhost:3000/v1/api/users';

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Create a new FormData object
    const formData = new FormData();
    formData.append('image', image);
    formData.append('email', email);
    formData.append('studentNumber', studentNumber);
    formData.append('name', name);

    try {
      // Send the form data to the server using axios
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset the form fields
      setImage('');
      setEmail('');
      setStudentNumber('');
      setName('');

      // Check the response status and set success or error message accordingly
      if (response.status === 201) {
        setSuccess(response.data.message);
        console.log(response.data.message);
        setError('');
      } else if (response.status === 400 || response.status === 500) {
        setSuccess('');
        setError(response.data.message);
        console.log(response.data.message);
      }
    } catch (error) {
      // Handle any errors that occur during form submission
      console.error('An error occurred:', error);
      setError('An error occurred while registering the user.');
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className={style['form-group']}>
        {error && <div className={style['toast-error']}>{error}</div>}
        {success && <div className={style['toast-success']}>{success}</div>}
        <div>
          {image && (
            <div>
              <label>Chosen Image:</label>
              <img
                src={URL.createObjectURL(image)}
                alt='Chosen Image'
                className={style['responsive-image']}
              />
            </div>
          )}
          <label htmlFor='image'>Image:</label>
          <input type='file' id='image' onChange={handleImageChange} />
        </div>
        <div>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor='studentNumber'>Student Number:</label>
          <input
            type='text'
            id='studentNumber'
            value={studentNumber}
            onChange={(event) => setStudentNumber(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor='name'>Name:</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <button
          type='submit'
          className={`${style['btn']} ${style['btn-primary']}`}
        >
          Register
        </button>
      </form>
    </>
  );
}

export default UserRegistration;
