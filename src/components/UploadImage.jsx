import axios from 'axios';
import { useState } from 'react';
import styles from './UploadImage.module.css';
import Spinner from './Spinner';
import FormControl from './FormControl';

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [imageError, setImageError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const API_URL =
    import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000/v1/api/';

  const api = axios.create({
    baseURL: API_URL,
    headers: { 'x-auth-token': localStorage.getItem('x-auth-token') },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setImageError('Please select a file');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5
      setImageError('File size should not exceed 5MB');
      return;
    }
    setImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setImageError(null);
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

  const validateImage = () => {
    return !!image;
  };

  const validateTitle = () => {
    return title.trim() !== '';
  };

  const validateDescription = () => {
    return description.trim() !== '';
  };

  const handleNextStep = () => {
    if (step === 1 && !validateImage()) {
      setImageError('Please select an image.');
      return;
    } else {
      setImageError('');
    }
    if (step === 2 && !validateTitle()) {
      setTitleError('Please enter a title.');
      return;
    } else {
      setTitleError('');
    }
    setStep(step + 1);
  };

  const handleSave = async () => {
    if (!validateDescription()) {
      setDescriptionError('Please enter a description.');
      return;
    } else {
      setDescriptionError('');
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('description', description);

    setUploading(true);
    setUploadSuccess(false);

    try {
      await api.post('/posts', formData);
      if (image) {
        setImage(null);
        setImagePreviewUrl(null);
        // reload image gallery component
        window.location.reload();
      } else {
        setImageError('Please select an image.');
      }
      setUploadSuccess(true);
    } catch (error) {
      setUploadError(true);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setImage(null);
    setImagePreviewUrl(null);
    setTitle('');
    setDescription('');
    setStep(1);
    setUploading(false);
    setUploadSuccess(false);
    setUploadError(false);
  };

  return (
    <div className={styles.container}>
      {uploading ? (
        <Spinner />
      ) : (
        <>
          {step === 1 && (
            <div className={styles['control-container']}>
              <h2>
                Step 1: Add Image{' '}
                <span className={styles['text-secondary']}>
                  ( Max Image File Size 5mb )
                </span>
              </h2>
              <div className={styles['control-container']}>
                {imageError && <div className={styles.error}>{imageError}</div>}
                <FormControl
                  label='Image'
                  type={'file'}
                  change={handleImageChange}
                  error={imageError}
                />
                <button
                  onClick={handleNextStep}
                  className={`${styles.btn} ${styles['btn-primary']}`}
                >
                  Next
                </button>
              </div>

              <div className={styles['image-container']}>
                {imagePreviewUrl && (
                  <img
                    src={imagePreviewUrl}
                    alt='Preview'
                    className={styles.preview}
                  />
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles['control-container']}>
              <h2>Step 2: Add Title</h2>
              {titleError && <div className={styles.error}>{titleError}</div>}
              <FormControl
                type={'text'}
                label='Title'
                change={handleTitleChange}
              />
              <button
                onClick={handlePreviousStep}
                className={`${styles.btn} ${styles['btn-neutral']}`}
              >
                Previous
              </button>
              <button
                onClick={handleNextStep}
                className={`${styles.btn} ${styles['btn-primary']}`}
              >
                Next
              </button>
            </div>
          )}

          {step === 3 && (
            <div className={styles['control-container']}>
              <h2>Step 3: Add Description</h2>
              {descriptionError && (
                <div className={styles.error}>{descriptionError}</div>
              )}
              <FormControl
                type={'text'}
                label='Description'
                change={handleDescriptionChange}
              />
              <div className={styles['control-container']}>
                <button
                  onClick={handleSave}
                  className={`${styles.btn} ${styles['btn-primary']}`}
                >
                  Save
                </button>
                <button
                  onClick={handlePreviousStep}
                  className={`${styles.btn} ${styles['btn-neutral']}`}
                >
                  Previous
                </button>

                <button
                  onClick={handleCancel}
                  className={`${styles.btn} ${styles['btn-neutral']}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UploadImage;
