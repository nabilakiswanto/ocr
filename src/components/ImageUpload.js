"use client";

import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [nik, setNIK] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setLoading(true);

      try {
        const { data: { text } } = await Tesseract.recognize(file, 'ind', {
          logger: info => console.log(info) // Log progress
        });
        parseText(text);
      } catch (err) {
        setError('Error during OCR processing.');
        console.error("Error during OCR processing.", err);
      }
      
      setLoading(false);
    }
  };

  const parseText = (text) => {
    const nikMatch = text.match(/NIK\s*(.*)/i);
    const nameMatch = text.match(/Nama\s*(.*)/i);
    const dobMatch = text.match(/Tempat\/Tgl Lahir\s*(.*)/i);
    const genderMatch = text.match(/Jenis Kelamin\s*(.*)/i);

    if (nikMatch) setNIK(nikMatch[1].trim());
    if (nameMatch) setName(nameMatch[1].trim());
    if (dobMatch) setDob(dobMatch[1].trim());
    if (genderMatch) setGender(genderMatch[1].trim());
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginBottom: '10px' }}
      />
      {loading && <p>Processing...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {image && (
        <div>
          <img src={image} alt="Uploaded" style={{ width: '100%', marginTop: '10px' }} />
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

export default ImageUpload;
