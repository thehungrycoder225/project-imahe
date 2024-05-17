import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../middleware/AuthContext';
import axios from 'axios';
import styles from './Profile.module.css';
import Button from '../components/Button';
import FormControl from '../components/FormControl';
import Dropzone from '../components/Dropzone';
import ProfileGallery from '../components/ProfileGallery';
import UploadImage from '../components/UploadImage';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'x-auth-token': localStorage.getItem('x-auth-token') },
});

const Profile = () => {
  const { user, logout } = useContext(AuthContext); // Use logout from AuthContext
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { setUser, setIsAuthenticated } = useContext(AuthContext); // Use AuthContext
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    } else if (countdown === 0) {
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [countdown]);

  const [formValues, setFormValues] = useState({
    name: user.name,
    email: user.email,
    studentNumber: user.studentNumber,
    image: user.image,
  });

  const handleEdit = () => {
    setEditMode(true);
  };

  // Update formValues state whenever an input field changes
  const handleInputChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]:
        event.target.type === 'file'
          ? event.target.files[0]
          : event.target.value,
    });
  };

  // Update user data in the database
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', formValues.name);
      formData.append('email', formValues.email);
      formData.append('studentNumber', formValues.studentNumber);
      formData.append('image', formValues.image);

      const response = await api.put(`users/${user._id}`, formData);

      if (response.status === 200) {
        setUser(response.data.user);
        setUserData(response.data.user);
        setSuccessMessage('Profile updated successfully');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setEditMode(false);
        setCountdown(5);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setError(
        error.response.data ? error.response.data.message : error.message
      );
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleLogout = () => {
    logout(); // Use logout function from AuthContext
  };
  return (
    <>
      <h1 className={styles.title}>Portfolio</h1>
      {successMessage && (
        <div className={styles['profile-alert-success']}>
          {successMessage} Dismiss in {countdown} seconds.
          <button onClick={() => setSuccessMessage(null)}>x</button>
        </div>
      )}
      {errorMessage && (
        <div className={styles['profile-alert-success']}>
          {errorMessage} Dismiss in {countdown} seconds.
          <button onClick={() => setErrorMessage(null)}>x</button>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.profile}>
          <div className={styles['profile-image-container']}>
            <img
              src={
                userData.image ||
                'https://images.unsplash.com/photo-1561948955-570b270e7c36?q=80&w=1801&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
              alt={userData.image}
              className={styles['profile-image']}
            />
          </div>
          <div className={styles['profile-info-container']}>
            <div className={styles['profile-info']}>
              <div>
                <h2>Student Details</h2>
                <h3>Student Number:</h3>
                {editMode ? (
                  <FormControl
                    type={'text'}
                    name={'studentNumber'}
                    id={'studentNumber'}
                    value={userData.studentNumber}
                    disabled={true}
                    state={'disabled'}
                  />
                ) : (
                  <p>{userData.studentNumber}</p>
                )}
              </div>
              <div>
                <h3>Name:</h3>
                {editMode ? (
                  <FormControl
                    type={'text'}
                    name={'name'}
                    value={formValues.name}
                    id={'name'}
                    change={handleInputChange}
                  />
                ) : (
                  <p>{userData.name}</p>
                )}
              </div>
              <div>
                <h3>Email:</h3>
                {editMode ? (
                  <FormControl
                    type={'email'}
                    name={'email'}
                    value={formValues.email}
                    id={'email'}
                    change={handleInputChange}
                  />
                ) : (
                  <p>{userData.email}</p>
                )}
              </div>
            </div>
            <div className={styles['profile-action-container']}>
              {editMode ? (
                <>
                  <Button
                    click={handleUpdate}
                    text={loading ? 'Saving...' : 'Save'}
                    color={'btn-dark'}
                    size={'btn-block'}
                    disabled={loading}
                  />
                  <Button
                    click={handleCancel}
                    text={'Cancel'}
                    size={'btn-block'}
                    color={'btn-neutral'}
                  />
                </>
              ) : (
                <>
                  <Button
                    click={handleEdit}
                    text={'Update Profile'}
                    color={'btn-primary'}
                    size={'btn-block'}
                  />
                  <Button
                    click={handleLogout}
                    text={'Logout'}
                    size={'btn-block'}
                    color={'btn-neutral'}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles}>
          <h3>Upload Photo</h3>
          <UploadImage />
        </div>
        <div className={styles}>
          <h3>My Gallery</h3>
          <ProfileGallery />
        </div>
      </div>
    </>
  );
};

export default Profile;
