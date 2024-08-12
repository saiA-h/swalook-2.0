import React, { useState, useEffect } from 'react';
import '../Styles/AdminLogin.css';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import ForgetPassword from './ForgetPassword';
import Logo1 from '../../assets/S_logo.png';
import axios from 'axios';
import Cookies from 'js-cookie';
import Popup from './Popup';

function AdminLogin() {
  const navigate = useNavigate();
  const { admin_url, salon_name } = useParams();

  // Decode and trim the variables
  const decodedAdminUrl = decodeURIComponent(admin_url).trim();
  const decodedSname = decodeURIComponent(salon_name).trim();

  const burl = btoa(decodedAdminUrl);
  localStorage.setItem('s-name', decodedSname);

  console.log(decodedAdminUrl, decodedSname);

  const [isValid, setIsValid] = useState(false); 
  const [mobileno, setMobileno] = useState('');
  const [password, setPassword] = useState('');

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // useEffect(() => {
  //   const loggedIn = Cookies.get('loggedIn');
  //   const userType = Cookies.get('type');
  //   const salonName = Cookies.get('salonName');
  //   const branch_n = Cookies.get('branch_n');
  //   const salon = Cookies.get('salon-name');
    
  //   if (loggedIn === 'true') {
  //     // if (userType === 'vendor') {
  //     //   navigate(`/${salonName}`);
  //     // }
  //       if (userType === 'admin') {
  //       navigate(`/${salon}/${branch_n}/dashboard`);
  //     } else if (userType === 'staff') {
  //       navigate(`/${salon}/${btoa(branch_n)}/dashboard`);
  //     }
  //   }
  // }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.crm.swalook.in/api/swalook/verify/${decodedSname}/${decodedAdminUrl}/`);
        if (response.data.status === true) {
          console.log(response.data);
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [decodedSname, decodedAdminUrl]);

  useEffect(() => {
    localStorage.setItem('branch_name', burl);
  }, [burl]);

  const handleAdminLogin = (e) => {
    console.log(mobileno, password);

    e.preventDefault();

    axios.post('https://api.crm.swalook.in/api/swalook/admin/login/', {
      mobileno: mobileno,
      password: password,
    })
    .then((res) => {
      if (res.data.text === 'login successfull !') {
        Cookies.set('loggedIn', 'true', { expires: 10 });
        Cookies.set('type', res.data.type, { expires: 10 });
        Cookies.set('branch_n', res.data.branch_name, { expires: 10 });
        Cookies.set('salon-name',res.data.salon_name, { expires: 10 });
        navigate(`/${decodedSname}/${burl}/dashboard`); // Navigate to the dashboard with URL parameter
        const token = res.data.token;
        const number = btoa(res.data.user);
        localStorage.setItem('token', token);
        localStorage.setItem('number', number);
        localStorage.setItem('type', res.data.type);
      } 
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
      setErrorMessage('Invalid login credentials. Please check your credentials and try again.');
      setShowError(true);
    });
  };

  const handleClosePopup = () => {
    setShowError(false);
  };

  const handleResetPasswordClick = () => {
    navigate('/forgetpassword');
  };

  return (
    <div className='Admin_login_container'>
      <Helmet>
        <title>Admin Login</title>
      </Helmet>
      {isValid ? (
        <div className='admin_login_main'>
          <div className='admin_left'>
            <div className='admin_logo'>
              <img className='admin_S_logo' src={Logo1} alt='Logo' />
            </div>
            <div className='admin_form'>
              <h1 className='admin_login_head'>Admin Login</h1>
              <form onSubmit={handleAdminLogin}>
                <div className='AL_input-group'>
                  <label htmlFor='phone-number'>Admin Name:</label>
                  <input
                    type='text'
                    id='phone-number'
                    name='phoneNumber'
                    placeholder='Enter your phone number'
                    onChange={(e) => setMobileno(e.target.value)}
                    required
                  />
                </div>
                <div className='AL_input-group'>
                  <label htmlFor='password'>Password:</label>
                  <input
                    type='password'
                    id='password'
                    name='password'
                    placeholder='Enter your password'
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <p className='forgot-password'>
                  Forgot your password?{' '}
                  <a onClick={handleResetPasswordClick}>Reset it</a>
                </p>
                <button type='submit'>Login</button>
              </form>
            </div>
          </div>

          <div className='admin_right'>
            <div className='admin_loginbg'>
              <div className='welcome_text'></div>
            </div>
          </div>
          {showError && <Popup message={errorMessage} onClose={handleClosePopup} />}
        </div>
      ) : (
        <div>
          <h1>Invalid Admin URL</h1>
        </div>
      )}
    </div>
  );
}

export default AdminLogin;
