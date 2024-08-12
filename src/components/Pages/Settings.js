import React from 'react'
import '../Styles/Settings.css'
import { Link } from 'react-router-dom';
import Header from './Header'
import PI from '../../assets/PI.png'
import HD from '../../assets/HD.png'
import SY from '../../assets/SY.png'
import CLP from '../../assets/CLP.png'

function Settings() {
  const branchName = localStorage.getItem('branch_name');
const sname = localStorage.getItem('s-name');
  return (
    <div className='settings_container'>
        <Header />
        <div className="content_container">
        <Link to={`/${sname}/${branchName}/settings/personalInformation`} className="settings_box" >
          <img src={PI} alt="Personal Information" />
          <h2>Personal Information</h2>
          <p>Manage your account details</p>
        </Link>
        <Link to={`/${sname}/${branchName}/settings/clpsetting`} className="settings_box">
          <img src={CLP} alt="clp" />
          <h2>Customer Loyality</h2>
          <p>Edit your customer loyality settings here</p>
        </Link>
        <Link to={`/${sname}/${branchName}/help`} className="settings_box">
          <img src={HD} alt="Help Desk" />
          <h2>Help Desk</h2>
          <p>Resolve your Query</p>
        </Link>
        </div>
    </div>
  )
}

export default Settings