"use client";

import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Choose an Option</h1>
      <div style={{ marginTop: '20px' }}>
        <Link href="/upload">
          <button style={{ marginRight: '10px' }}>Upload Photo</button>
        </Link>
        <Link href="/capture">
          <button>Capture Picture</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
