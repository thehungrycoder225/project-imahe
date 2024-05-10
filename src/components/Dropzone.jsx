import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import styles from './Dropzone.module.css';

const MyDropzone = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);

    const data = new FormData();
    acceptedFiles.forEach((file) => {
      data.append('file', file);
    });

    setIsUploading(true);
    axios
      .post('/upload', data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      })
      .then(() => {
        setUploadProgress(0);
        setIsUploading(false);
      });
  }, []);

  const removeFile = (file) => () => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*', // Only accept image files
  });

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img src={file.preview} style={{ width: '100px' }} alt='preview' />
      </div>
      <button onClick={removeFile(file)}>Remove file</button>
    </div>
  ));
  return (
    <div className={styles.dropzone}>
      <div
        {...getRootProps({ className: 'dropzone' })}
        style={{
          border: '2px dashed #888',
          padding: '20px',
          borderRadius: '5px',
        }}
      >
        <input {...getInputProps()} />
        <div className='text-center'>
          <i className='fa fa-upload fa-3x mb-3'></i>
          {isDragActive ? (
            <p className='lead'>Drop the files here ...</p>
          ) : (
            <p className='lead'>
              Drag 'n' drop some files here, or click to select files
            </p>
          )}
        </div>
      </div>
      <aside>
        <h4>Files</h4>
        {thumbs}
      </aside>
    </div>
  );
};

export default MyDropzone;
