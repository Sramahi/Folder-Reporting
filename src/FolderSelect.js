import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import './FolderSelect.css';

const FolderSelect = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  // used to get the navigation function, which allows navigating to different routes.
  const navigate = useNavigate();

  //to handle the files dropped or selected by the user
  const onDrop = (acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
  };

  //when Generate Report button is clicked. It passes the selected folder as state in the navigation options.
  const navigateToReport = () => {
    navigate('/report', { state: { files: selectedFiles } });
  };

  //attach the necessary props and event handlers to the appropriate elements.
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    directory: true,
  });

  return (
    <div className="folder-select-container">
      <h1>Select a Folder</h1>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>{selectedFiles.length > 0 ? `Chosen Folder: ${selectedFiles[0].path}` : 'Drag and drop a folder here or click to select a folder.'}</p>
      </div>
      <button onClick={navigateToReport} disabled={selectedFiles.length === 0}>
        Generate Report
      </button>
    </div>
  );
};

export default FolderSelect;