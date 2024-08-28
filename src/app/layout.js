import React from 'react';
import Head from 'next/head';
import './globals.css'; // Include global styles if you have any

export const metadata = {
  title: 'registration',
  description: 'ocr-nextjs',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
      </Head>
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
