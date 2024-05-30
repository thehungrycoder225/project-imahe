import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styles from './Gallery.module.css';
import Spinner from '../components/Spinner';
import { Helmet } from 'react-helmet';
import Modal from '../components/Modal';
import { fetchAuthorPosts } from '../middleware/Api';
import LazyLoad from 'react-lazy-load';
import { debounce } from 'lodash';
import FormControl from '../components/FormControl';

import axios from 'axios';

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imgRefs = useRef([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [authorPosts, setAuthorPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const [query, setQuery] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const api = useMemo(
    () =>
      axios.create({
        baseURL: API_URL,
        headers: { 'x-auth-token': localStorage.getItem('x-auth-token') },
      }),
    [API_URL]
  );

  const fetchPosts = useCallback(
    debounce(async () => {
      setLoading(true);
      const response = await api.get(`/posts?page=${page}&authorName=${query}`);
      if (Array.isArray(response.data.postsImages)) {
        setImages(response.data.postsImages);
      } else {
        console.error(
          'postsImages is not an array:',
          response.data.postsImages
        );
      }
      setTotalPages(response.data.totalPages);
      setLoading(false);
    }, 500),
    [api, page, query]
  );

  const handleScroll = useCallback(() => {
    if (query) return; // Add this line
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    if (page <= totalPages && !loading) {
      setPage(page + 1);
    }
  }, [page, totalPages, loading, query]); // Add query to the dependency array

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    fetchPosts();
  }, [query, fetchPosts]);

  useEffect(() => {
    if (authorPosts.length > 0) {
      setLoading(false);
    }
  }, [authorPosts]);

  useEffect(() => {
    imgRefs.current = imgRefs.current.slice(0, images.length);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove(styles.lazy);
            observer.unobserve(lazyImage);
          }
        });
      },
      { rootMargin: '0px 0px 200px 0px' }
    );

    imgRefs.current.forEach((imgRef) => observer.observe(imgRef));

    return () => {
      imgRefs.current.forEach((imgRef) => {
        if (
          imgRef instanceof Element &&
          observer.takeRecords().find((e) => e.target === imgRef)
        ) {
          observer.unobserve(imgRef);
        }
      });
    };
  }, [images]);

  const fetchAuthorPostsCallback = useCallback(async (authorId) => {
    const posts = await fetchAuthorPosts(authorId);
    setAuthorPosts(posts);
  }, []);

  const handleAuthorClick = useCallback(
    (authorId) => {
      setIsModalVisible(true);
      fetchAuthorPostsCallback(authorId);
    },
    [fetchAuthorPostsCallback]
  );

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className={styles['gallery-container']}>
      <Helmet>
        <title>Imahe | Gallery</title>
      </Helmet>
      <h1 className={`${styles['gallery-title']} ${styles['text-center']}`}>
        Imahe
      </h1>{' '}
      <div className={styles['search-container']}>
        <FormControl
          type={'text'}
          placeholder={'Search...'}
          name={'authorName'}
          id={'authorName'}
          value={query}
          change={(e) => setQuery(e.target.value.trim().toLowerCase())}
          label={'Search'}
        />
      </div>
      {loading ? (
        <>
          <div className={styles['spinner-container']}>
            <Spinner />
          </div>
        </>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles['card-grid']}>
          {images.map((image, index) => (
            <div key={index} className={styles.card}>
              <img
                ref={(el) => (imgRefs.current[index] = el)}
                data-src={image.url}
                alt={image.title}
                className={styles.lazy}
              />
              <div className={styles['card-info']}>
                <h3 className={styles.title}> Title: {image.title}</h3>
                <p className={styles.description}>
                  {' '}
                  <span className={styles['text-bold']}>Description:</span>{' '}
                  {image.description}
                </p>
                <p
                  className={styles.author}
                  onClick={() => handleAuthorClick(image.author._id)}
                >
                  Captured by:{' '}
                  <span className={styles['author-link']}>
                    {image.author.name}
                  </span>
                </p>
              </div>
            </div>
          ))}
          {loading && <Spinner />}
          <Modal
            visible={isModalVisible}
            onClose={() => {
              setIsModalVisible(false);
            }}
          >
            {loading ? (
              <div className='modal-container'>
                <Spinner />
              </div>
            ) : (
              <>
                <button
                  className='modal-close-button'
                  onClick={() => {
                    setIsModalVisible(false);
                    setAuthorPosts([]);
                    setSelectedPost(null);
                  }}
                >
                  x
                </button>
                <div className='modal-container'>
                  <div>
                    <h1 className='text-center text-title'>
                      {!authorPosts.length ? (
                        <>
                          <Spinner />
                          <p>Loading...</p>
                        </>
                      ) : selectedPost ? (
                        selectedPost.title
                      ) : (
                        authorPosts[0]?.author.name + "'s Gallery"
                      )}
                    </h1>
                  </div>
                  {selectedPost ? (
                    <div>
                      <div className='container'>
                        <div className='card'>
                          <img
                            src={selectedPost.url}
                            alt={selectedPost.title}
                            className=''
                          />
                          <p className='text-selected-post-description  '>
                            {selectedPost.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPost(null);
                        }}
                        className='modal-return-button '
                      >
                        Back to posts
                      </button>
                    </div>
                  ) : (
                    <div className='card-container'>
                      {authorPosts.map((post) => (
                        <LazyLoad key={post._id} offset={100}>
                          <div
                            key={post._id}
                            className='card'
                            onClick={() => handlePostClick(post)}
                          >
                            <img
                              src={post.url}
                              alt={post.title}
                              className='modal-image'
                            />
                            <p className='card-info text-description text-center'>
                              {post.title}
                            </p>
                          </div>
                        </LazyLoad>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </Modal>
          {images.length === 0 && !loading && !error && <p>No images found</p>}
        </div>
      )}
    </div>
  );
}

export default Gallery;
