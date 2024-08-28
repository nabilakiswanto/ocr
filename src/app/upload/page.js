// app/upload/page.js
"use client";

import React from 'react';
import ImageUpload from '../../components/ImageUpload'; // Adjust the path if necessary

const UploadPage = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Upload Photo</h1>
      <ImageUpload />
    </div>
  );
};

export default UploadPage;
