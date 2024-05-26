import React, { useState } from 'react';
import { LoginPage } from './login/LoginPage';
import { RegistrationPage } from './register/RegistrationPage';
import { UploadPage } from './upload/UploadPage';
import { DownloadPage } from './download/DownloadPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handleNavigation = page => {
    setCurrentPage(page);
  };

  let content;
  if (currentPage === 'login') {
    content = <LoginPage />;
  } else if (currentPage === 'register') {
    content = <RegistrationPage />;
  } else if (currentPage === 'upload') {
    content = <UploadPage  />;
  } else if (currentPage === 'download') {
    content = <DownloadPage />;
  }

  return (
    <div>
      <nav>
        <ul>
          <li onClick={() => handleNavigation('login')}>Login</li>
          <li onClick={() => handleNavigation('register')}>Register</li>
          {/*<li onClick={() => handleNavigation('upload')}>Upload</li>*/}
          {/*<li onClick={() => handleNavigation('download')}>Download</li>*/}
        </ul>
      </nav>

      <div className="container">
        {content}
      </div>
    </div>
  );
}

export default App;
