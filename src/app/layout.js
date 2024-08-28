import React from 'react';
import './globals.css'; // Include global styles if you have any

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
