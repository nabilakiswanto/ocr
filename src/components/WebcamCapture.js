"use client";

import React, { useRef, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { Camera } from 'react-camera-pro';

const WebcamCapture = () => {
  const [nik, setNIK] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraType, setCameraType] = useState('user'); // 'user' for front, 'environment' for rear
  const cameraRef = useRef(null);

  const handleCapture = async () => {
    setLoading(true);
    const imageSrc = cameraRef.current.getScreenshot();

    try {
      const { data: { text } } = await Tesseract.recognize(imageSrc, 'eng');
      parseText(text);
    } catch (err) {
      console.error("Error during OCR processing.", err);
    }
    setLoading(false);
  };

  const parseText = (text) => {
    const nikMatch = text.match(/NIK:\s*(.*)/i);
    const nameMatch = text.match(/Nama:\s*(.*)/i);
    const dobMatch = text.match(/Tempat\/Tgl Lahir:\s*(.*)/i);
    const genderMatch = text.match(/Jenis Kelamin:\s*(.*)/i);

    if (nikMatch) setNIK(nikMatch[1]);
    if (nameMatch) setName(nameMatch[1]);
    if (dobMatch) setDob(dobMatch[1]);
    if (genderMatch) setGender(genderMatch[1]);
  };

  const handleCameraSwitch = () => {
    setCameraType(cameraType === 'user' ? 'environment' : 'user');
  };

  return (
    <div>
      <Camera
        ref={cameraRef}
        facingMode={cameraType} // Switch camera based on cameraType
        screenshotFormat="image/jpeg"
        width="100%"
        height="100%"
      />
      <button onClick={handleCapture} disabled={loading}>
        {loading ? 'Processing...' : 'Capture & Process'}
      </button>
      <form>
        <div>
          <label>NIK:</label>
          <input type="text" value={nik} onChange={(e) => setNIK(e.target.value)} />
        </div>
        <div>
          <label>Nama:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>TTL:</label>
          <input type="text" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div>
          <label>Jenis Kelamin:</label>
          <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
        </div>
        <button type="submit">Register</button>
      </form>
      <button onClick={handleCameraSwitch}>
        Switch Camera
      </button>
    </div>
  );
};

export default WebcamCapture;
