import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from './Gallery.module.css';
import Spinner from '../components/Spinner';

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imgRefs = useRef([]);
  import.meta.VITE_REACT_APP_API_URL || 'http://localhost:3000/v1/api';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/v1/api/posts');
        setImages(response.data.postsImages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchImages();
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

  return (
    <div>
      <h1>Gallery</h1>
      <div className={styles['card-grid']}>
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
