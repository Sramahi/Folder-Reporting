import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Report.css';

function Report() {
  const location = useLocation();
  const { files } = location.state;

  // Function to generate the report data
  const generateReport = () => {
    const fileCountsByType = {};
    let totalFiles = 0;
    let totalFolders = 0;

    // Recursive function to process files and calculate counts
    const processFiles = (files) => {
      for (const current of files) {
        if (current.isDirectory) {
          totalFolders++;
          processFiles(current.children);
        } else {
          const fileType = current.name.split('.').pop();
          fileCountsByType[fileType] = (fileCountsByType[fileType] || 0) + 1;
          totalFiles++;
        }
      }
    };

    processFiles(files);

     // Extracting file metadata
    const fileMetadata = files.map((file) => {
      const { name, size, lastModifiedDate } = file;
      return { name, size, lastModifiedDate };
    });

    return {
      totalFiles,
      totalFolders,
      fileCountsByType,
      fileMetadata,
    };
  };

  const reportData = generateReport();

  const calculatePercentage = (count, total) => {
    return ((count / total) * 100).toFixed(2);
  };

  // State variables for sorting and searching
  const [sortAttribute, setSortAttribute] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (attribute) => {
    const newSortOrder = sortAttribute === attribute && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortAttribute(attribute);
    setSortOrder(newSortOrder);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDownload = (file) => {
    const { contents, type, name } = file;
  
    const blob = new Blob([contents], { type });
  
    try {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // For IE/Edge browsers
        window.navigator.msSaveOrOpenBlob(blob, name);
      } else {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.target = "_blank"; // Open the file in a new tab
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };
  
  // File counts and total count for rendering file types
  const fileCounts = Object.values(reportData.fileCountsByType);
  const totalCount = fileCounts.reduce((sum, count) => sum + count, 0);

  // JSX for rendering file types and their counts
  const fileTypes = Object.keys(reportData.fileCountsByType).map((type, index) => {
    const count = reportData.fileCountsByType[type];
    const percentage = calculatePercentage(count, totalCount);
    const progressBarStyles = {
      width: `${percentage}%`,
      backgroundColor: '#42b983',
    };

    return (
      <li key={index}>
        <div className="file-type-label">{type}</div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={progressBarStyles}></div>
        </div>
        <div className="count-label">Count: {count}</div>
        <div className="percentage-label">Percentage: {percentage}%</div>
      </li>
    );
  });

  // Sorting and filtering file metadata based on sort attribute and search query
  const sortedMetadata = reportData.fileMetadata.sort((a, b) => {
    const aValue = sortAttribute === 'size' ? Number(a[sortAttribute]) : a[sortAttribute];
    const bValue = sortAttribute === 'size' ? Number(b[sortAttribute]) : b[sortAttribute];

    if (sortAttribute === 'lastModifiedDate') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    } else {
      if (sortAttribute === 'size') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        return sortOrder === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
    }
  });

  const filteredMetadata = sortedMetadata.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // JSX for rendering file metadata table rows
  const fileMetadata = filteredMetadata.map((file, index) => (
    <tr key={index}>
      <td>{file.name}</td>
      <td>{file.size}</td>
      <td>{file.lastModifiedDate.toString()}</td>
      <td>
        <button onClick={() => handleDownload(file)}>Download</button>
      </td>
    </tr>
  ));

  return (
    <div className="report-container">
      <h1>Report</h1>
      <p>Total files: {reportData.totalFiles}</p>      
      <h3>File Counts by Type:</h3>
      <ul>{fileTypes}</ul>
      <h3>File Metadata:</h3>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by name"
        className="search-input" // Added CSS class for search input
      />
      <table>
        <thead>
          <tr>
            <th>
              <button
                className={`sort-button ${sortAttribute === 'name' ? 'active' : ''}`}
                onClick={() => handleSort('name')}
              >
                Name {sortAttribute === 'name' && <span className="sort-arrow">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </button>
            </th>
            <th>
              <button
                className={`sort-button ${sortAttribute === 'size' ? 'active' : ''}`}
                onClick={() => handleSort('size')}
              >
                Size {sortAttribute === 'size' && <span className="sort-arrow">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </button>
            </th>
            <th>
              <button
                className={`sort-button ${sortAttribute === 'lastModifiedDate' ? 'active' : ''}`}
                onClick={() => handleSort('lastModifiedDate')}
              >
                Last Modified {sortAttribute === 'lastModifiedDate' && <span className="sort-arrow">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{fileMetadata}</tbody>
      </table>
    </div>
  );
}

export default Report;
