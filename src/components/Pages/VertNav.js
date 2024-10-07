import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/VertNav.css';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DescriptionIcon from '@mui/icons-material/Description';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp'; // Added Settings icon
import Logo from '../../assets/header_crm_logo.webp'; 
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import HeadphonesIcon from '@mui/icons-material/Headphones'; 
import Cookies from 'js-cookie';

const NavItem = ({ to, icon: Icon, label, disabled }) => {
  const disabledStyle = disabled ? { pointerEvents: 'none', opacity: 0.5 } : {};

  return (
    <div className="icon-container" style={disabledStyle} title={disabled ? 'Not permitted' : ''}>
      {disabled ? (
        <>
          <Icon style={{ fontSize: 27, margin: '5px', color: 'black' }} />
          <span className="icon-text">{label}</span>
        </>
      ) : (
        <Link to={to} className="nav-link" style={{ width: '233px', height: '56px', textDecoration: 'none', color: 'black' }}>
          <div className="nav-item" style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderRadius: '12px 0 0 0' }}>
            <Icon style={{ fontSize: 27, margin: '5px', color: 'black' }} />
            <span className="icon-text" style={{ marginLeft: '10px' }}>{label}</span>
          </div>
        </Link>
      )}
    </div>
  );
};

const DashboardButton = ({ userType, sname, branchName }) => {
  const dashboardLink = userType === 'vendor' ? `/${sname}/owner` : `/${sname}/${branchName}/dashboard`;

  return (
    <Link to={dashboardLink} style={{ textDecoration: 'none', width: '233px' }}>
      <button className="dashboard-button">
        <GridViewRoundedIcon style={{ fontSize: 24, marginRight: 8, color: 'white' }} />
        Dashboard
      </button>
    </Link>
  );
};

const SupportButton = ({ sname, branchName }) => {
  return (
    <button 
      className="nav-button" 
      style={{ 
        background: '#5E63661A', 
        border: 'none', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '46px', 
        borderRadius: '16px',
        marginRight:'10px'
      }}
    >
      <Link 
        to={`/${sname}/${branchName}/help`} 
        style={{ 
          textDecoration: 'none', 
          color: 'black', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%', 
          fontFamily: 'Inter', 
          fontSize: '14px', 
          fontWeight: 400, 
          lineHeight: '16.94px', 
          textAlign: 'left',
        }}
      >
        <HeadphonesIcon style={{ marginRight: '10px' }} />
        Help
      </Link>
    </button>
  );
};

const SettingsButton = ({ userType, sname, branchName }) => {
  const disabledStyle = { pointerEvents: 'none', opacity: 0.5 };

  return (
    <>
      {(userType === 'staff' || userType === 'vendor') ? (
        <button className="nav-button" style={disabledStyle}>
          <span style={{ color: 'black', fontFamily: 'Inter', fontSize: '14px' }}>Settings</span>
        </button>
      ) : (
        <button className="nav-button" style={{ backgroundColor: '#FFCC9133' }}>
          <Link 
            to={`/${sname}/${branchName}/settings`} 
            style={{ 
              textDecoration: 'none', 
              color: 'black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              fontFamily: 'Inter', 
              fontSize: '14px', 
              fontWeight: 400, 
              lineHeight: '16.94px', 
              textAlign: 'left',
          
            }}
          >
            <SettingsSharpIcon style={{ marginRight: '10px' }} />
            Settings
          </Link>
        </button>
      )}
    </>
  );
};

const VertNav = () => {
  const navigate = useNavigate();
  const branchName = localStorage.getItem('branch_name');
  const sname = localStorage.getItem('s-name');
  const userType = localStorage.getItem('type');

  const handleLogout = () => {
    Cookies.remove('loggedIn');
    Cookies.remove('type');
    Cookies.remove('salonName');
    Cookies.remove('branch_n');
    Cookies.remove('salon-name');
    navigate("/"); // Redirect to home or login page
  };

  return (
    <div className='vert_nav_main_c'>
      <img 
        src={Logo} 
        alt="Swalook Logo" 
        className="swalook-logo" 
        style={{ 
          width: '101px', 
          height: '90px', 
          position: 'absolute', 
          top: '6px', 
          left: '89px', 
          opacity: '1', 
          marginBottom: '20px',
        }} 
      />
      <DashboardButton userType={userType} sname={sname} branchName={branchName} />
      <div className="nav-items">
        <NavItem to={`/${sname}/${branchName}/appointment`} icon={BookOnlineIcon} label="Appointments" />
        <NavItem to={`/${sname}/${branchName}/generatebill`} icon={DescriptionIcon} label="Invoices" />
        <NavItem
          to={`/${sname}/${branchName}/analysis`}
          icon={ShowChartIcon}
          label="Analysis"
          disabled={userType === 'staff'}
        />
        <NavItem
          to={`/${sname}/${branchName}/inventory`}
          icon={StorefrontIcon}
          label="Inventory"
          disabled={userType === 'staff'}
        />
        <NavItem
          to={`/${sname}/${branchName}/clp`}
          icon={CardMembershipIcon}
          label="Customers"
          disabled={userType === 'staff'}
        />
        <br />
        <br />
        <SupportButton sname={sname} branchName={branchName} />
        <SettingsButton userType={userType} sname={sname} branchName={branchName} />
      </div>
      <button 
        className="logout-button" 
        onClick={handleLogout} 
        style={{ 
          backgroundColor: 'white', 
          color: '#CC5F5F', 
          width: '90px', 
          height: '40px', 
          marginTop: 'auto', 
          borderRadius: '16px 0 0 0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          border: '1px solid #CC5F5F',
          padding: '11px 0',
          fontFamily: 'Inter', 
          marginLeft: '90px',
          fontSize: '14px', 
          fontWeight: 400, 
          lineHeight: '16.94px', 
          marginTop:'135px'
        }}
      >
        <LogoutRoundedIcon style={{ fontSize: 16, color: '#CC5F5F', marginRight: '10px' }} />
        Logout
      </button>
    </div>
  );
};

export default VertNav;
