"use client";

import React from 'react';
import WebcamCapture from '../../components/WebcamCapture'; // Adjust the path if necessary

const CapturePage = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Capture Picture</h1>
      <WebcamCapture />
    </div>
  );
};

export default CapturePage;
