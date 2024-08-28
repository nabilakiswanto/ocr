"use client";

import React, { useRef, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { CameraSwitch } from 'react-camera-pro'; // Import react-camera-pro

const WebcamCapture = () => {
  const [nik, setNIK] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    // Check if the device is mobile
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobile = /android|iPad|iPhone|iPod/.test(userAgent);
    setIsMobile(mobile);

    if (mobile) {
      // Check for camera devices if mobile
      const getDevices = async () => {
        try {
          const deviceInfos = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = deviceInfos.filter(deviceInfo => deviceInfo.kind === 'videoinput');
          setDevices(videoDevices);

          const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')) ||
                             videoDevices.find(device => device.label.toLowerCase().includes('rear')) ||
                             videoDevices[0];
          if (rearCamera) {
            setSelectedDeviceId(rearCamera.deviceId);
          }
        } catch (err) {
          console.error("Error accessing media devices.", err);
        }
      };

      getDevices();
    }
  }, []);

  const handleCapture = async () => {
    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();

    try {
      const { data: { text } } = await Tesseract.recognize(imageSrc, 'ind');
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

  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value);
  };

  if (isMobile) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '400px', margin: 'auto' }}>
          <CameraSwitch
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            height="100%"
            videoConstraints={{ deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined }}
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
        <div>
          <label>Switch Camera:</label>
          <select onChange={handleDeviceChange} value={selectedDeviceId || ''}>
            <option value="" disabled>Select a camera</option>
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: 'center' }}>
        <p>This application is best viewed on a mobile device. Please use a mobile phone for optimal functionality.</p>
      </div>
    );
  }
};

export default WebcamCapture;
