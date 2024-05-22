import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../middleware/AuthContext';
import axios from 'axios';
import styles from './ProfileGallery.module.css';
import FormControl from './FormControl';
import Button from './Button';
import Spinner from './Spinner';

function ProfileGallery() {
  const { user } = useContext(AuthContext); // Use logout from AuthContext
  const [userPosts, setUserPosts] = useState(); // Add userPosts state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    image: null,
  });

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
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

  const handleDelete = async (post) => {
    setLoading(true);
    try {
      await api.delete(`/posts/${post._id}`);
      // Update userPosts state by filtering out the deleted post
      setLoading(false);
      setUserPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  const handleInputChange = (event) => {
    if (event.target.type === 'file') {
      const file = event.target.files[0];
      if (!file) {
        setImageError('Please select a file');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setImageError('Please select an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        // 2MB
        setImageError('File size should not exceed 2MB');
        return;
      }
      setImageError(null); // clear any previous error
      setFormValues({ ...formValues, [event.target.name]: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormValues({ ...formValues, [event.target.name]: event.target.value });
    }
  };

  const handleUpdate = async () => {
    if (editingPost) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('title', formValues.title);
        formData.append('description', formValues.description);
        if (formValues.image instanceof Blob) {
          formData.append('image', formValues.image);
        }

        const response = await api.put(`/posts/${editingPost._id}`, formData);

        if (response.status === 200) {
          // If the server does not return the url of the updated image,
          // manually create an object URL from the image Blob and add it to the post
          if (formValues.image instanceof Blob) {
            response.data.url = URL.createObjectURL(formValues.image);
          }

          // Update the post in the userPosts state
          setUserPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === editingPost._id ? response.data.post : post
            )
          );
          setEditingPost(null);
          setFormValues({
            title: '',
            description: '',
            image: null,
          });
        } else {
          throw new Error('Failed to update post');
        }
      } catch (error) {
        setError(
          error.response.data ? error.response.data.message : error.message
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingPost(null);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormValues({
      title: post.title,
      description: post.description,
      image: null,
    });
  };

  return (
    <div>
      {loading ? (
        <>
          <div className={styles['spinner-container']}>
            <Spinner />
            <div>
              <p>Loading...</p>
            </div>
          </div>
        </>
      ) : error ? (
        <p> {error.response.data.error}</p>
      ) : userPosts && userPosts.length > 0 ? (
        <div className={styles['image-container']}>
          {imageError && <p className={styles.error}>{imageError}</p>}
          {userPosts.map((post) => (
            <div key={post._id} className={styles.card}>
              {editingPost && editingPost._id === post._id ? (
                <div className={styles['card-info']}>
                  {editingPost.image && editingPost.image instanceof Blob ? (
                    <img
                      src={URL.createObjectURL(editingPost.image)}
                      alt={editingPost.title}
                      className={styles.galleryImage}
                    />
                  ) : (
                    <img
                      src={post.url}
                      alt={post.title}
                      className={styles.galleryImage}
                    />
                  )}
                  <FormControl
                    type='file'
                    name='image'
                    label={'Image'}
                    change={handleInputChange}
                  />

                  <FormControl
                    type='text'
                    name='title'
                    label={'Title'}
                    value={formValues.title}
                    change={handleInputChange}
                  />
                  <FormControl
                    type='text'
                    name='description'
                    label={'Description'}
                    value={formValues.description}
                    change={handleInputChange}
                  />
                  <Button
                    text={loading ? 'Saving...' : 'Save'}
                    color={'btn-dark'}
                    size={'btn-block'}
                    disabled={loading}
                    click={handleUpdate}
                  />
                  <Button
                    text={'Cancel'}
                    size={'btn-block'}
                    click={handleCancel}
                  />
                </div>
              ) : (
                <>
                  <img
                    src={post.url}
                    alt={post.title}
                    className={styles.galleryImage}
                  />
                  <div className={styles['card-info']} key={post._id}>
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
                    <Button
                      text={'Edit'}
                      color={'btn-dark'}
                      click={() => handleEdit(post)}
                    />
                    <Button
                      text={'Delete'}
                      color={'btn-danger'}
                      click={() => handleDelete(post)}
                    />
                  </div>
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
