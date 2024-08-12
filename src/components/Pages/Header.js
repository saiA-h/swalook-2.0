import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../components/Styles/Header.css';
import Logo from '../../assets/header_crm_logo.webp';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from 'js-cookie';
import ServiceDetails from './ServiceDetails';
import VertNav from './VertNav';

const disabledStyle = {
  pointerEvents: 'none',
  cursor: 'not-allowed',
  opacity: 0.5,
};

function Header() {
  const navRef = useRef();
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const inputFileRef = useRef(null);
  const [profileImage, setProfileImage] = useState("");
  const branchName = localStorage.getItem('branch_name');
  const sname = localStorage.getItem('s-name');
  const userType = localStorage.getItem('type');  

  // const handleLogout = () => {
  //   const branchN = Cookies.get('branch_n');
    
  //   // Redirect to the login 
  //   if (userType === 'staff') {
  //     navigate(`/${sname}/${branchN}/staff`);
  //   } else if (userType === 'admin') {
  //     navigate(`/${sname}/${branchN}/admin`);
  //   } else {
  //     navigate("/");
  //   }
  //   Cookies.remove('loggedIn');
  //   Cookies.remove('type');
  //   Cookies.remove('salonName');
  //   Cookies.remove('branch_n');
  //   Cookies.remove('salon-name');
  // };

  const handleLogout = () => {
    // Redirect to the login
    navigate("/");
    Cookies.remove('loggedIn');
    Cookies.remove('type');
    Cookies.remove('salonName');
    Cookies.remove('branch_n');
    Cookies.remove('salon-name');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  const handleChooseImage = () => {
    inputFileRef.current.click();
  };

  const showNavbar = () => {
    navRef.current.classList.toggle('responsive_nav');
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className='nav-btn ' onClick={showNavbar}>
          <MenuIcon sx={{ fontSize: '36px' }} />
        </button>
        <img src={Logo} alt="Logo" className="header_logo" />
      </div>
      <div>
        <div className="navbar-center" ref={navRef}>
          <button className="nav-button">
            <Link to={userType === 'vendor' ? `/${sname}/owner` : `/${sname}/${branchName}/dashboard`} className="nav-link">Home</Link>
          </button>
          {(userType === 'staff' || userType === 'vendor') ? (
            <button className="nav-button" style={disabledStyle}>
              <span className="nav-link">Service</span>
            </button>
          ) : (
            <button className="nav-button">
              <Link to={`/${sname}/${branchName}/service`} className="nav-link">Service</Link>
            </button>
          )}
          {(userType === 'staff' || userType === 'vendor') ? (
            <button className="nav-button" style={disabledStyle}>
              <span className="nav-link">Settings</span>
            </button>
          ) : (
            <button className="nav-button">
              <Link to={`/${sname}/${branchName}/settings`} className="nav-link">Settings</Link>
            </button>
          )}
          <button className="nav-button">
            <Link to={`/${sname}/${branchName}/help`} className="nav-link">Help</Link>
          </button>
          <button className='nav-btn nav-close-btn'>
            <CloseIcon onClick={showNavbar} sx={{ fontSize: '36px' }} />
          </button>
        </div>
      </div>
      <div className="navbar-right">
        <div className="user-photo" onClick={toggleDropdown}>
          {profileImage ? (
            <img src={URL.createObjectURL(profileImage)} alt="Profile" className="profile-image" />
          ) : (
            <AccountCircleIcon sx={{ fontSize: '36px' }} />
          )}
          <div className="down-arrow"></div>
          {showDropdown && (
            <div className="dropdown-menu" ref={dropdownRef}>
              {/* <div className="dropdown-item" onClick={handleChooseImage}>
                <PersonAddIcon sx={{ marginRight: '5px', verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle' }}>Change Profile Picture</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  ref={inputFileRef}
                  style={{ display: 'none' }}
                />
              </div> */}
              <div className="dropdown-item" onClick={handleLogout}>
                <LogoutIcon sx={{ marginRight: '5px', verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle' }}>LogOut</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
