import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
const api = axios.create({
  baseURL: API_URL,
  headers: { 'x-auth-token': localStorage.getItem('x-auth-token') },
});

export const fetchImages = async () => {
  const response = await api.get('/posts');
  return response.data.postsImages;
};

export const fetchAuthorPosts = async (authorId) => {
  const response = await api.get(`/posts/author/${authorId}`);
  return response.data;
};
