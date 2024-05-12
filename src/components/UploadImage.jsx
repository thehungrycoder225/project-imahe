import axios from 'axios';
import { useState } from 'react';
import styles from './UploadImage.module.css';
import Spinner from './Spinner';

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const API_URL =
    import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000/v1/api/';

  const api = axios.create({
    baseURL: API_URL,
    headers: { 'x-auth-token': localStorage.getItem('x-auth-token') },
  });

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
      setImagePreviewUrl(URL.createObjectURL(event.target.files[0]));
    }
  };
  const handleTitleChange = (event) => {
    if (event.target.value.length <= 50) {
      setTitle(event.target.value);
    }
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleNextStep = () => {
    if (step === 1 && !image) {
      alert('Please select an image.');
      return;
    }
    if (step === 2 && title.trim() === '') {
      alert('Please enter a title.');
      return;
    }
    setStep(step + 1);
  };

  const handleSave = async () => {
    if (description.trim() === '') {
      alert('Please enter a description.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('description', description);

    setUploading(true);
    setUploadSuccess(false);

    try {
      await api.post('/posts', formData);
      console.log('Upload successful');
      setUploadSuccess(true);
    } catch (error) {
      console.error(error);
      setUploadError(true);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    // Perform cancel logic here
    // Reset the form or navigate to another page
  };

  return (
    <div className={styles.container}>
      {uploading && <Spinner />}
      {uploadSuccess && <p>Upload successful!</p>}
      {uploadError && <p>Upload failed. Please try again.</p>}
      {step === 1 && (
        <div>
          <h2>Step 1: Add Image</h2>
          <input type='file' accept='image/*' onChange={handleImageChange} />
          {imagePreviewUrl && <img src={imagePreviewUrl} alt='Preview' />}
          <button onClick={handleNextStep}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Step 2: Add Title</h2>
          <input type='text' value={title} onChange={handleTitleChange} />
          <button onClick={handlePreviousStep}>Previous</button>
          <button onClick={handleNextStep}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Step 3: Add Description</h2>
          <textarea value={description} onChange={handleDescriptionChange} />
          <button onClick={handlePreviousStep}>Previous</button>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
