import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../middleware/AuthContext';
import axios from 'axios';
import styles from './Profile.module.css';
import Button from '../components/Button';
import FormControl from '../components/FormControl';
import Dropzone from '../components/Dropzone';

const API_URL =
  import.meta.VITE_REACT_APP_API_URL || 'http://localhost:3000/v1/api';

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
  const navigateTo = useNavigate();

  const [formValues, setFormValues] = useState({
    name: user.name,
    email: user.email,
    avatar: null,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/users/${user._id}`);
      setUserData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
      fetchData();
    }
  }, [fetchData, user]);

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

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    // Create a new FormData object
    const formData = new FormData();

    // Append the data you want to send
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });

    try {
      // Send a PUT request with the FormData object
      const response = await api.put(`/users/${user._id}`, formData);
      if (response.status === 200) {
        setUserData(response.data);
        setEditMode(false);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'An error occurred while updating your profile. Please try again.'
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleCreateAlbum = async () => {
    try {
      const response = await api.post('/albums', { name: 'New Album' });
      setUserData({
        ...userData,
        albums: [...userData.albums, response.data],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadImage = async (albumId, image) => {
    try {
      const response = await api.post(`/albums/${albumId}/images`, { image });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout(); // Use logout function from AuthContext
    navigateTo('/');
  };
  return (
    <>
      <h1 className={styles.title}>Portfolio</h1>
      <div className={styles.container}>
        <div className={styles.Profile}>
          <div>
            <img
              src={userData.image}
              alt={userData.image}
              className={styles['profile-image']}
            />
          </div>
          <div>
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
                text={'Edit'}
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
        <div className={styles.Widgets}>
          <h3>Stats</h3>
        </div>
        <div className={styles.Photos}>
          <h3>Photos</h3>
          <Dropzone />
        </div>
      </div>
    </>
  );
};

export default Profile;
