"use client";

import React, { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import Webcam from 'react-webcam';

const WebcamCapture = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);

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
    // Example: Simple parsing logic to extract name and date of birth
    const nameMatch = text.match(/Name:\s*(.*)/i);
    const dobMatch = text.match(/Date of Birth:\s*(.*)/i);

    if (nameMatch) setName(nameMatch[1]);
    if (dobMatch) setDob(dobMatch[1]);
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        height="100%"
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
    </div>
  );
};

export default WebcamCapture;
