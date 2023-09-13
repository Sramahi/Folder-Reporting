import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import FolderSelect from './FolderSelect';
import Report from './Report';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/folder-select">Folder Select</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/folder-select" element={<FolderSelect />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;