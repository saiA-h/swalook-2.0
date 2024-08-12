import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/VertNav.css';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DescriptionIcon from '@mui/icons-material/Description';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import CardMembershipIcon from '@mui/icons-material/CardMembership';

function VertNav() {
  const branchName = localStorage.getItem('branch_name');
  const sname = localStorage.getItem('s-name');
  const userType = localStorage.getItem('type');

  const disabledStyle = {
    pointerEvents: 'none',
    cursor: 'not-allowed',
    opacity: 0.5,
  };

  return (
    <div className='vert_nav_main_c'>
      <div className="icon-container">
        <Link to={`/${sname}/${branchName}/appointment`}>
          <BookOnlineIcon style={{ fontSize: 27, margin: '5px', color: 'white' }} />
          <span className="icon-text">Appointment</span>
        </Link>
      </div>
      <div className="icon-container">
        <Link to={`/${sname}/${branchName}/generatebill`}>
          <DescriptionIcon style={{ fontSize: 27, margin: '5px', color: 'white' }} />
          <span className="icon-text">Invoice</span>
        </Link>
      </div>
      <div
        className="icon-container"
        style={userType === 'staff' ? disabledStyle : {}}
        title={userType === 'staff' ? 'Not permitted' : ''}
      >
        {userType !== 'staff' ? (
          <Link to={`/${sname}/${branchName}/analysis`}>
            <ShowChartIcon style={{ fontSize: 27, margin: '5px', color: 'white' }} />
            <span className="icon-text">Analysis</span>
          </Link>
        ) : (
          <>
            <ShowChartIcon style={{ fontSize: 27, margin: '5px', color: 'white' }} />
            <span className="icon-text">Analysis</span>
          </>
        )}
      </div>
      <div
        className="icon-container"
        style={userType === 'staff' ? disabledStyle : {}}
        title={userType === 'staff' ? 'Not permitted' : ''}
      >
        {userType !== 'staff' ? (
          <Link to={`/${sname}/${branchName}/inventory`}>
            <StorefrontIcon style={{ fontSize: 27, margin: '5px', color: 'white' }} />
            <span className="icon-text">Inventory</span>
          </Link>
        ) : (
          <>
            <StorefrontIcon style={{ fontSize: 27, margin: '5px', color: 'white' }} />
            <span className="icon-text">Inventory</span>
          </>
        )}
      </div>
      {/* <div
        className="icon-container"
        style={userType === 'staff' ? disabledStyle : {}}
        title={userType === 'staff' ? 'Not permitted' : ''}
      >
        {userType !== 'staff' ? (
          <Link to={`/${sname}/${branchName}/clp`}>
            <p style={{ fontSize: 15, fontWeight: 'bold', margin: '5px', marginTop: '5px', color: 'white' }}>CLP</p>
            <span className="icon-text">Customer Loyalty Program</span>
          </Link>
        ) : (
          <>
            <p style={{ fontSize: 15, fontWeight: 'bold', margin: '5px', marginTop: '5px', color: 'white' }}>CLP</p>
            <span className="icon-text">Customer Loyalty Program</span>
          </>
        )}
      </div> */}
     <div
      className="icon-container"
      style={userType === 'staff' ? disabledStyle : {}}
      title={userType === 'staff' ? 'Not permitted' : ''}
    >
      {userType !== 'staff' ? (
        <Link to={`/${sname}/${branchName}/clp`}>
          <CardMembershipIcon
            style={{ fontSize: 27, margin: '5px', color: 'white' }}
          />
          <span className="icon-text">Customer Loyalty Program</span>
        </Link>
      ) : (
        <>
          <CardMembershipIcon
            style={{ fontSize: 27, margin: '5px',  color: 'white' }}
          />
          <span className="icon-text">Customer Loyalty Program</span>
        </>
      )}
    </div>
    </div>
  );
}

export default VertNav;
