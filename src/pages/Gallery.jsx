import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from './Gallery.module.css';
import Spinner from '../components/Spinner';
import Masonry from 'masonry-layout';

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imgRefs = useRef([]);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const api = axios.create({
    baseURL: API_URL,
    headers: { 'x-auth-token': localStorage.getItem('x-auth-token') },
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await api.get('/posts');
        setImages(response.data.postsImages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const gridRef = useRef(null);

  useEffect(() => {
    if (gridRef.current) {
      new Masonry(gridRef.current, {
        itemSelector: `.${styles.card}`,
        columnWidth: `.${styles.card}`,
        fitWidth: true,
        gutter: 20,
      });
    }
  }, []);

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
      imgRefs.current.forEach((imgRef) => observer.unobserve(imgRef));
    };
  }, [images]);

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className={`${styles['gallery-title']} ${styles['text-center']}`}>
        Imahe
      </h1>
      <div ref={gridRef} className={styles['card-grid']}>
        {loading ? (
          <Spinner />
        ) : (
          images.map((image, index) => (
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
                  Description: {image.description}
                </p>
                <p className={styles.author}>
                  {' '}
                  Captured by: {image.author.name}
                </p>
              </div>
            </div>
          ))
        )}

        {images.length === 0 && !loading && !error && <p>No images found</p>}
      </div>
    </div>
  );
}

export default Gallery;
