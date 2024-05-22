import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './Gallery.module.css';
import Spinner from '../components/Spinner';
import { Helmet } from 'react-helmet';
import Modal from '../components/Modal';
import { fetchImages, fetchAuthorPosts } from '../middleware/Api';
import LazyLoad from 'react-lazy-load';

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imgRefs = useRef([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [authorPosts, setAuthorPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const images = await fetchImages();
        setImages(images);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      // setLoading(true);
      fetchAuthorPostsCallback(authorId);
    },
    [fetchAuthorPostsCallback]
  );

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  if (loading)
    return (
      <div className={styles['spinner-container']}>
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Helmet>
        <title>Imahe | Gallery</title>
      </Helmet>
      <h1 className={`${styles['gallery-title']} ${styles['text-center']}`}>
        Imahe
      </h1>
      <div className={styles['card-grid']}>
        {images.map((image, index) => (
          <LazyLoad key={image._id} offset={100}>
            <div key={image._id} className={styles.card}>
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
          </LazyLoad>
        ))}
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
                          <img src={post.url} alt={post.title} className='' />
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
    </div>
  );
}

export default Gallery;
