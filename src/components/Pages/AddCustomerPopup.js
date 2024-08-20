import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/AddCustomerPopup.css';
import Popup from './Popup';
import CircularProgress from '@mui/material/CircularProgress';
import config from '../../config';


function AddCustomerPopup({ onClose }) {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loyaltyProgram, setLoyaltyProgram] = useState('');
  const [points, setPoints] = useState(0);
  const [expiryDays, setExpiryDays] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const branchName = localStorage.getItem('branch_name');
  const sname = localStorage.getItem('s-name');
  const [programTypes, setProgramTypes] = useState([]);

  const bid = localStorage.getItem('branch_id');

  useEffect(() => {
    const fetchProgramTypes = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${config.apiUrl}/api/swalook/loyality_program/view/?branch_name=${bid}`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        setProgramTypes(response.data.data.map(program => ({
          id: program.id,
          type: program.program_type
        })));
      } catch (error) {
        console.error('An error occurred while fetching program types:', error);
      }
    };

    fetchProgramTypes();
  }, []);

  console.log(programTypes);
  
  
  const handleSubmit = async (e) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const bid = localStorage.getItem('branch_id');
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiUrl}/api/swalook/loyality_program/customer/?branch_name=${bid}`, {    
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          name: customerName,
          mobile_no: customerNumber,
          email: email,
          membership: loyaltyProgram
        }),
      });

      const result = await response.json();
     
      

      if (response.ok) {
        setPopupMessage('Customer added successfully!');
        setShowPopup(true);
        onClose();  
        window.location.reload();
      } else {
        setPopupMessage('Failed to add customer.');
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage('An error occurred.');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ac_popup_overlay">
      <div className="ac_popup_container">
        <div className="ac_popup_header">
          <div className='ac_popup_title'>
            <h3>Add Customer</h3>
          </div>
          <button className="ac_close_button" onClick={onClose}>X</button>
        </div>
        <hr className="ac_divider"/>
        <form onSubmit={handleSubmit}>
          <div className="ac_field">
            <label htmlFor="customer_name">Name:</label>
            <input 
              type="text" 
              id="customer_name" 
              name="customer_name" 
              placeholder='Customer Name' 
              required 
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="ac_field">
            <label htmlFor="customer_number">Number:</label>
            <input 
              type="text" 
              id="customer_number" 
              name="customer_number" 
              placeholder="Customer Number" 
              required 
              onChange={(e) => setCustomerNumber(e.target.value)}
            />
          </div>
          <div className="ac_field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="ac_field">
            <label htmlFor="loyalty_program">Loyalty Program:</label>
            <select
              id="loyalty_program"
              name="loyalty_program"
              required
              value={loyaltyProgram}
              onChange={(e) => setLoyaltyProgram(e.target.value)}
            >  
              <option value="">Select</option>
              {programTypes.map(program => (
                <option key={program.id} value={program.type}>
                  {program.type.charAt(0).toUpperCase() + program.type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="ac_field">
            <label htmlFor="points">Points:</label>
            <input 
              type="number" 
              id="points" 
              name="points" 
              placeholder="Points" 
              required 
              value={points}
            //   onChange={(e) => setPoints(e.target.value)}
            />
          </div>
          <div className="ac_button_container">
            <button className="ac_save_button">
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
      {showPopup && <Popup message={popupMessage} onClose={() => { setShowPopup(false); navigate(`/${sname}/${branchName}/clp`); }} />}
    </div>
  );
}

export default AddCustomerPopup;
