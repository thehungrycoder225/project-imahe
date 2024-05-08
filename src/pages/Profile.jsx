import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../middleware/AuthContext';

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
    <div>
      <h1>Profile</h1>
      <div>
        <label>Image:</label>
        {editMode ? (
          <input
            type='text'
            name='image'
            value={userData.image}
            onChange={handleInputChange}
          />
        ) : (
          <img src={`${userData.image}`} alt='Profile' />
        )}
      </div>
      <div>
        <label>Name:</label>
        {editMode ? (
          <input
            type='text'
            name='name'
            value={userData.name}
            onChange={handleInputChange}
          />
        ) : (
          <span>{userData.name}</span>
        )}
      </div>
      <div>
        <label>Student Number:</label>
        {editMode ? (
          <input
            type='text'
            name='studentNumber'
            value={userData.studentNumber}
            onChange={handleInputChange}
          />
        ) : (
          <span>{userData.studentNumber}</span>
        )}
      </div>
      <div>
        <label>Email:</label>
        {editMode ? (
          <input
            type='text'
            name='email'
            value={userData.email}
            onChange={handleInputChange}
          />
        ) : (
          <span>{userData.email}</span>
        )}
      </div>
      {editMode ? (
        <>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleCreateAlbum}>Create Album</button>
        </>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
      {/* Render the albums and upload image functionality */}
    </div>
  );
};

export default Profile;
