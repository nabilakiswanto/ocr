"use client";

import React, { useRef, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import Webcam from 'react-webcam';

const WebcamCapture = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    // Get list of video input devices (cameras)
    navigator.mediaDevices.enumerateDevices()
      .then((deviceInfos) => {
        const videoDevices = deviceInfos.filter(deviceInfo => deviceInfo.kind === 'videoinput');
        setDevices(videoDevices);

        // Set default device (usually the first one in the list)
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices.", err);
      });
  }, []);

  const handleCapture = async () => {
    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();

    Tesseract.recognize(
      imageSrc,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    ).then(({ data: { text } }) => {
      parseText(text);
      setLoading(false);
    });
  };

  const parseText = (text) => {
    const nameMatch = text.match(/Name:\s*(.*)/i);
    const dobMatch = text.match(/Date of Birth:\s*(.*)/i);

    if (nameMatch) setName(nameMatch[1]);
    if (dobMatch) setDob(dobMatch[1]);
  };

  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value);
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        height="100%"
        videoConstraints={{ deviceId: selectedDeviceId }}
      />
      <button onClick={handleCapture} disabled={loading}>
        {loading ? 'Processing...' : 'Capture & Process'}
      </button>
      <form>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input type="text" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <button type="submit">Register</button>
      </form>
      <div>
        <label>Select Camera:</label>
        <select onChange={handleDeviceChange} value={selectedDeviceId}>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default WebcamCapture;
