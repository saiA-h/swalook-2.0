import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../components/Styles/Header.css';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Cookies from 'js-cookie';


function Header() {
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const userType = localStorage.getItem('type');
  const sname = localStorage.getItem('s-name');
  const branchName = localStorage.getItem('branch_name');

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="dashboard-heading">Dashboard</h1>
        <hr className="divider-line" />
      </div>
      <div className="navbar-right">
        <div className="user-photo" onClick={toggleDropdown}>
          {profileImage ? (
            <img src={URL.createObjectURL(profileImage)} alt="Profile" className="profile-image" />
          ) : (
            <AccountCircleIcon className="account-icon" />
          )}
          <div className="down-arrow"></div>
          {showDropdown && (
            <div className="dropdown-menu" ref={dropdownRef}>
              {userType === 'staff' || userType === 'vendor' ? (
                <button className="nav-button" style={{ cursor: 'not-allowed', opacity: 0.5 }}>
                  <span className="nav-link">Service</span>
                </button>
              ) : (
                <Link to={`/${sname}/${branchName}/service`} className="nav-link">
                  <div className="dropdown-item">
                    <span>Service</span>
                  </div>
                </Link>
              )}
              {/* Add other dropdown items here if needed */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
