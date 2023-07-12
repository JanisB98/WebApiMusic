import React, { useState } from 'react';
function FileUploadComponent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const token = localStorage.getItem('accessToken');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Create a new FormData object
      const formData = new FormData();
      formData.append('Title', fileName);
      formData.append('FormFile', selectedFile);
      // Make the API request to upload the file
      // Replace 'upload-url' with your actual upload endpoint
      console.log(token);
      fetch('https://localhost:7104/api/music/upload', {
        headers: {
          Authorization: "Bearer " + token,
        },
        method: 'POST',
        body: formData,
      })
      .then((response) => {
        if (response.ok) {
          console.log('Request successful');
        }
      })
      .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUploadComponent;
