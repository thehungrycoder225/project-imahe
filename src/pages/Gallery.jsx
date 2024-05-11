import axios from 'axios';
import { useEffect, useState } from 'react';

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/v1/api/posts').then((response) => {
      setImages(response.data.postsImages);
      setLoading(false);
      console.log(response.data.postsImages);
    });
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Gallery</h1>
      <div>
        {images.map((image) => (
          <img
            key={image._id}
            src={`${image.image}`}
            alt={image.title}
            style={{ width: '100%' }}
          />
        ))}
      </div>
    </div>
  );
}

export default Gallery;
