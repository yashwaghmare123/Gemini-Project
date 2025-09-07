import React from 'react';

const ImageTest = () => {
  const testImages = [
    'http://localhost:3001/api/images/notes_python_1757280619855.png',
    'http://localhost:3001/api/images/notes_python_1757280657987.png',
    'http://localhost:3001/api/images/quiz_photosynthesis_1757280933410.png'
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Image Loading Test</h2>
      {testImages.map((url, index) => (
        <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Image {index + 1}</h3>
          <p>URL: {url}</p>
          <img 
            src={url} 
            alt={`Test image ${index + 1}`}
            style={{ maxWidth: '300px', height: 'auto' }}
            onLoad={() => console.log(`✅ Image ${index + 1} loaded successfully`)}
            onError={(e) => {
              console.error(`❌ Image ${index + 1} failed to load:`, e);
              console.error('Failed URL:', url);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageTest;
