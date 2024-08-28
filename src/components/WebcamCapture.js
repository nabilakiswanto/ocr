"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import Tesseract from 'tesseract.js';

const WebcamCapture = () => {
  const [cameraFacing, setCameraFacing] = useState('user'); // Default to user-facing camera
  const [nik, setNIK] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacing }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera", err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [cameraFacing]);

  const handleCapture = async () => {
    setLoading(true);
  
    // Capture the image from the video feed
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageSrc = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageSrc);
  
    try {
      // Load the image as an Image object
      const img = new Image();
      img.src = imageSrc;
      img.onload = async () => {
        // Optionally, preprocess the image here
        // e.g., convert to grayscale or adjust brightness/contrast
  
        try {
          const { data: { text } } = await Tesseract.recognize(img, 'eng', {
            logger: info => console.log(info) // Log progress
          });
          parseText(text);
        } catch (err) {
          console.error("Error during OCR processing.", err);
        }
        setLoading(false);
      };
    } catch (err) {
      console.error("Error loading image.", err);
      setLoading(false);
    }
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

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '100%', height: 'auto', margin: 'auto' }}>
        <video
          ref={videoRef}
          autoPlay
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <button onClick={toggleCamera} style={{ marginTop: '10px' }}>
        Switch Camera
      </button>
      <button onClick={handleCapture} disabled={loading} style={{ marginTop: '10px' }}>
        {loading ? 'Processing...' : 'Capture & Process'}
      </button>
      {capturedImage && (
        <div>
          <img src={capturedImage} alt="Captured" style={{ width: '100%', marginTop: '10px' }} />
        </div>
      )}
      <form style={{ marginTop: '20px' }}>
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
    </div>
  );
};

export default WebcamCapture;
