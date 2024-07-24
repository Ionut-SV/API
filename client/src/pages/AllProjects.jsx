import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FilePreview = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch file metadata from your backend
    axios.get('/api/files') // Your API endpoint to get file metadata
      .then(response => setFiles(response.data))
      .catch(error => console.error('Error fetching files:', error));
  }, []);

  return (
    <div className="file-previews">
      {files.map((file, index) => (
        <div key={index} className="file-preview">
          {file.type.startsWith('image/') ? (
            <img src={`/file/${file.filename}`} alt={file.filename} />
          ) : (
            <a href={`/file/${file.filename}`} download>
              Download {file.filename}
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilePreview;