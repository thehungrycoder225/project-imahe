import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../middleware/AuthContext';
import axios from 'axios';
import styles from './Profile.module.css';
import Button from '../components/Button';
import FormControl from '../components/FormControl';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(user);
  const token = localStorage.getItem('x-auth-token');

  useEffect(() => {
    if (user && user._id) {
      axios
        .get(`http://localhost:3000/v1/api/users/${user._id}`, {
          headers: { 'x-auth-token': token },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user, token]);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleUpdate = () => {
    axios
      .put('/api/user', userData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCreateAlbum = () => {
    axios
      .post('/api/albums', { name: 'New Album' })
      .then((response) => {
        setUserData({
          ...userData,
          albums: [...userData.albums, response.data],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUploadImage = (albumId, image) => {
    axios
      .post(`/api/albums/${albumId}/images`, { image })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <>
      <h1>Portfolio</h1>
      <div className={styles.container}>
        <div className={styles.Profile}>
          <h3>Hello {user.name}</h3>
          <div>
            <img src={userData.image} alt={userData.name} />
          </div>
          <div>
            <h3>Name:</h3>
            {editMode ? (
              <FormControl
                type={'text'}
                name={'name'}
                id={'name'}
                value={userData.name}
                change={handleInputChange}
              />
            ) : (
              <p>{userData.name}</p>
            )}
          </div>
          <div>
            <h3>Student Number:</h3>
            {editMode ? (
              <FormControl
                type={'text'}
                name={'studentNumber'}
                id={'studentNumber'}
                value={userData.studentNumber}
                change={handleInputChange}
              />
            ) : (
              <p>{userData.studentNumber}</p>
            )}
          </div>
          <div>
            <h3>Email:</h3>
            {editMode ? (
              <FormControl
                type={'email'}
                name={'email'}
                id={'email'}
                value={userData.email}
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
                text={'Save'}
                color={'btn-dark'}
                size={'btn-block'}
              />
              <Button click={handleCancel} text={'Cancel'} size={'btn-block'} />
            </>
          ) : (
            <Button
              click={handleEdit}
              text={'Edit'}
              color={'btn-primary'}
              size={'btn-block'}
            />
          )}
        </div>
        <div className={styles.Widgets}>
          <h3>Stats</h3>
        </div>
        <div className={styles.Photos}>
          <h3>Photos</h3>
        </div>
      </div>
    </>
  );
};

export default Profile;
