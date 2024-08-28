"use client";

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsMobile(/android|iPad|iPhone|iPod/.test(userAgent));

    if (isMobile) {
      navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
        const videoDevices = deviceInfos.filter(deviceInfo => deviceInfo.kind === 'videoinput');
        setDevices(videoDevices);
        const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')) ||
                           videoDevices.find(device => device.label.toLowerCase().includes('rear')) ||
                           videoDevices[0];
        if (rearCamera) setSelectedDeviceId(rearCamera.deviceId);
      });
    }
  }, [isMobile]);

  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {isMobile ? (
        <div>
          <div style={{ position: 'relative', width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '400px', margin: 'auto' }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              height="100%"
              videoConstraints={{ deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined }}
            />
          </div>
          <button onClick={() => console.log(webcamRef.current.getScreenshot())}>
            Capture
          </button>
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
      ) : (
        <p>This application is best viewed on a mobile device. Please use a mobile phone for optimal functionality.</p>
      )}
    </div>
  );
};

export default WebcamCapture;