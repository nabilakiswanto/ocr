"use client";

import React, { useState, useEffect, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { Camera } from 'react-camera-pro';

const WebcamCapture = () => {
  const [nik, setNIK] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('user'); // Default to user-facing camera

  useEffect(() => {
    // Check if the device is mobile
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsMobile(/android|iPad|iPhone|iPod/.test(userAgent));
  }, []);

  const handleCapture = async () => {
    setLoading(true);
    try {
      if (imageSrc) {
        const { data: { text } } = await Tesseract.recognize(imageSrc, 'ind');
        parseText(text);
        console.log("Text:", text);
      } else {
        console.error("No image source available for capture.");
      }
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

  const toggleCamera = () => {
    setCameraFacing((prevFacing) => (prevFacing === 'user' ? 'environment' : 'user'));
  };

  // if (isMobile) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%', height: 'auto', margin: 'auto' }}>
          <Camera
            facingMode={cameraFacing} // Control camera facing mode
            onCapture={(src) => setImageSrc(src)}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
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
        <button onClick={toggleCamera}>
          Switch Camera
        </button>
      </div>
    );
  // } else {
  //   return (
  //     <div style={{ textAlign: 'center' }}>
  //       <p>This application is best viewed on a mobile device. Please use a mobile phone for optimal functionality.</p>
  //     </div>
  //   );
  // }
};

export default WebcamCapture;