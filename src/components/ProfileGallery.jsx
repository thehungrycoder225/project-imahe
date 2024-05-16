import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../middleware/AuthContext';
import EditPostForm from './EditPostForm';
import axios from 'axios';
import styles from './ProfileGallery.module.css';

function ProfileGallery() {
  const { user, logout } = useContext(AuthContext); // Use logout from AuthContext
  const [userData, setUserData] = useState(user);
  const [userPosts, setUserPosts] = useState(); // Add userPosts state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const API_URL =
    import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000/v1/api/';

  const api = axios.create({
    baseURL: API_URL,
    headers: { 'x-auth-token': localStorage.getItem('x-auth-token') },
  });

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleSave = async (updatedPost) => {
    try {
      const response = await axios.put(
        `/api/posts/${updatedPost._id}`,
        updatedPost
      );
      setUserPosts(
        userPosts.map((post) =>
          post._id === updatedPost._id ? response.data : post
        )
      );
      setEditingPost(null);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get(`/posts/author/${user._id}`);
      setUserPosts(response.data);
    } catch (error) {
      setError(error);
      console.error(error);
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
        <p> {error.response.data.error}</p>
      ) : userPosts && userPosts.length > 0 ? (
        <div className={styles['card-grid']}>
          {userPosts.map((post) => (
            <div key={post._id} className={styles.card}>
              {editingPost && editingPost._id === post._id ? (
                <EditPostForm post={post} onSave={handleSave} />
              ) : (
                <>
                  <img
                    src={post.url}
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
                  <button onClick={() => handleEdit(post)}>Edit</button>
                </>
              )}
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
