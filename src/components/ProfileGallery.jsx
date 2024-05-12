import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../middleware/AuthContext';
import axios from 'axios';
import styles from './ProfileGallery.module.css';

function ProfileGallery() {
  const { user, logout } = useContext(AuthContext); // Use logout from AuthContext
  const [userData, setUserData] = useState(user);
  const [userPosts, setUserPosts] = useState(); // Add userPosts state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { setUser, setIsAuthenticated } = useContext(AuthContext); // Use AuthContext

  const API_URL =
    import.meta.VITE_REACT_APP_API_URL || 'http://localhost:3000/v1/api';

  const api = axios.create({
    baseURL: API_URL,
    headers: { 'x-auth-token': localStorage.getItem('x-auth-token') },
  });

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get(`/posts/author/${user._id}`);
      setUserPosts(response.data);
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

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : userPosts && userPosts.length > 0 ? (
        <div className={styles['card-grid']}>
          {userPosts.map((post) => (
            <div key={post._id} className={styles.card}>
              <img
                src={post.image}
                alt={post.title}
                className={styles.galleryImage}
              />
              <div className={styles['card-info']}>
                <h3>
                  Title: <p className={styles.description}>{post.title}</p>
                </h3>
                <h4>
                  Description:{' '}
                  <p className={styles.description}>{post.description}</p>
                </h4>
                <h4>
                  Posted:
                  <p className={styles.author}>{post.createdAt}</p>
                </h4>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts found</p>
      )}
    </div>
  );
}

export default ProfileGallery;
