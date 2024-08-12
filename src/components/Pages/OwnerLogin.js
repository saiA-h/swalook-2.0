import React , {useState , useEffect} from 'react';
import Logo1 from '../../assets/header_crm_logo.webp';
import { Helmet } from 'react-helmet';
import '../Styles/OwnerLogin.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';
import CircularProgress from '@mui/material/CircularProgress';

function OwnerLogin() {
  const navigate = useNavigate();
  const [mobileno, setMobileno] = useState('');
  const [password, setPassword] = useState('');

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const loggedIn = Cookies.get('loggedIn');
  //   const userType = Cookies.get('type');
  //   const salonName = Cookies.get('salonName');
  //   const branch_n = Cookies.get('branch_n');
  //   const salon = Cookies.get('salon-name');
    
  //   if (loggedIn === 'true') {
  //     if (userType === 'vendor') {
  //       navigate(`/${salonName}`);
  //     } 
  //     else if (userType === 'admin') {
  //       navigate(`/${salon}/${branch_n}/dashboard`);
  //     } else if (userType === 'staff') {
  //       navigate(`/${salon}/${btoa(branch_n)}/dashboard`);
  //     }
  //   }
  // }, [navigate]);


  // const handleAdminLogin = async (e) => {
  //   console.log(mobileno, password);
  //   e.preventDefault();
  
  //   try {
  //     const response = await axios.post("https://api.crm.swalook.in/api/swalook/login/", {
  //       mobileno: mobileno,
  //       password: password
  //     });
  
  //     if (response.data.text === 'login successfull !') {
  //       Cookies.set('loggedIn', 'true', { expires: 10 });
  //       Cookies.set('type', response.data.type, { expires: 10 });
  //       const salonName = response.data.salon_name;
  //       Cookies.set('salonName', salonName, { expires: 10 });
  //       localStorage.setItem('s-name', salonName);
  //       localStorage.setItem('type', response.data.type);
  //       navigate(`/${salonName}`);
  //     }
  
  //     const token = response.data.token;
  //     const number = btoa(response.data.user);
  //     localStorage.setItem('token', token);
  //     localStorage.setItem('number', number);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log(error);
  //     setErrorMessage('Invalid login credentials. Please check your credentials and try again.');
  //     setShowError(true);
  //   }
  // };

  const handleAdminLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post("http://swallook.pythonanywhere.com/api/swalook/centralized/login/", {
        mobileno: mobileno,
        password: password
      });
      console.log(response.data);
      if (response.data.text === 'login successfull !') {
        Cookies.set('loggedIn', 'true', { expires: 10 });
        Cookies.set('type', response.data.type, { expires: 10 });
        const salonName = response.data.salon_name;
        Cookies.set('salonName', salonName, { expires: 10 });
        Cookies.set('branch_n', response.data.branch_name, { expires: 10 });
        localStorage.setItem('branch_name', btoa(response.data.branch_name));
        localStorage.setItem('s-name', salonName);
        localStorage.setItem('type', response.data.type);
        if(response.data.type === 'owner'){
          navigate(`/${salonName}`);
        }
        else if(response.data.type === 'admin'){
          navigate(`/${response.data.salon_name}/${btoa(response.data.branch_name)}/dashboard`);
        }
        else if(response.data.type === 'staff'){
          navigate(`/${response.data.salon_name}/${btoa(response.data.branch_name)}/dashboard`);
        }
      const token = response.data.token;
      const number = btoa(response.data.user);
      localStorage.setItem('token', token);
      localStorage.setItem('number', number);
      console.log(response.data);
    } 
  } catch (error) {
    console.log(error);
    setErrorMessage('Invalid login credentials. Please check your credentials and try again.');
    setShowError(true);
  } finally {
    setLoading(false);
  }
  };
  

  

  const handleClosePopup = () => {
    setShowError(false);
  };

  return (
    <div className='owner_login_container'>
      <div className='owner_login_main'>
        <div className='owner_left'>
          <div className='owner_logo'>
            <img className='owner_S_logo' src={Logo1} alt="Logo" />
          </div>
          <div className='owner_form'>
            <h1 className='owner_login_head'>Login</h1>
            <form onSubmit={handleAdminLogin}>
              <div className="OL_input-group">
                <label htmlFor="phone-number">Phone Number or Name:</label>
                <input
                  type="text"
                  id="phone-number"
                  name="phoneNumber"
                  placeholder="Enter your phone number or Name"
                  onChange={(e) => setMobileno(e.target.value)}
                  required
                />
              </div>
              <div className="OL_input-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <p className="forgot-password">Forgot your password? <a>Reset it</a></p>
              <button type="submit">
                {loading ? <CircularProgress  size={20} color="inherit"/> : 'Login'}
              </button>
            </form>
          </div>
        </div>
        <div className='owner_right'>
          <div className='owner_loginbg'>
            <div className='welcome_text'></div>
          </div>
        </div>
      </div>
      {showError && <Popup message={errorMessage} onClose={handleClosePopup} />}
    </div>
  )
}

export default OwnerLogin;
