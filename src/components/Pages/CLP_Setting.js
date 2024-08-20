import React, { useState, useEffect } from 'react';
import '../Styles/CLP_Setting.css';
import Header from './Header';
import CLP from '../../assets/CLP.png';
import { Helmet } from 'react-helmet';
import AddIcon from '@mui/icons-material/Add';
import config from '../../config';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

function CLP_Setting() {
  const [fetchedRows, setFetchedRows] = useState([]);
  const [newRows, setNewRows] = useState([]);
  const [threshold, setThreshold] = useState('');
  const [loading, setLoading] = useState(false);
  const bid = localStorage.getItem('branch_id');

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const branchName = localStorage.getItem('branch_name');
      const apiEndpoint = `${config.apiUrl}/api/swalook/loyality_program/view/?branch_name=${bid}`;
      

      try {
        const response = await axios.get(apiEndpoint, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.status) {
          setFetchedRows(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    };

    fetchData();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedNewRows = [...newRows];
    updatedNewRows[index] = { ...updatedNewRows[index], [field]: value };
    setNewRows(updatedNewRows);
  };

  const handleThresholdChange = (e) => {
    setThreshold(Number(e.target.value));
  };

  const handleAddRow = () => {
    setNewRows([...newRows, { type: '', points: '', expiry: '', charges: '' }]);
  };

  const handleSave = async () => {
    const branchName = localStorage.getItem('branch_name');
    const apiEndpoint = `${config.apiUrl}/api/swalook/loyality_program/?branch_name=${bid}`;

    setLoading(true);
    

    try {
 
      if (newRows.length > 0) {
        const response = await axios.post(apiEndpoint, {
          json_data: newRows,
          // minimum_amount: threshold,
          branch_name: atob(branchName),
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });

        console.log('Success:', response.data);
      } else {
        console.log('No new rows to save.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const apiEndpoint = `${config.apiUrl}/api/swalook/loyality_program/?id=${id}`;
    
    try {
      await axios.delete(apiEndpoint, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });
      // Update the state to remove the deleted row
      setFetchedRows(fetchedRows.filter(row => row.id !== id));
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };



  const [Minimum , setMinimum] = useState(0);

  useEffect(() => {
    const fetchAmount = async () => {
      const apiEndpoint = `${config.apiUrl}/api/swalook/loyality_program/get_minimum_value/?branch_name=${bid}`;
      try {
        const response = await axios.get(apiEndpoint, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.status) {
          setMinimum(response.data.data);
          setThreshold(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    }
    fetchAmount();
  }
  , []);
  
const handleThresholdSave = async () => {
  setLoading(true);
    const apiEndpoint = `${config.apiUrl}/api/swalook/loyality_program/get_minimum_value/?branch_name=${bid}`;

    try {
      const response = await axios.post(apiEndpoint, {
        minimum_amount: threshold,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });

      console.log('Threshold saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving threshold:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='clp_setting_container'>
      <Helmet>
        <title>CLP Settings</title>
      </Helmet>
      <Header />
      <div className='clp_main'>
        <div className='clp_settings_content'>
          <h1 className='clp_settings_heading'>Customer Loyalty Programme Settings</h1>
          <hr className='clp_divider' />
          <div className='clp_settings_body'>
            <div className='clp_image_container'>
              <img src={CLP} alt='CLP' />
            </div>
            <div className='clps_table_container'>
              <table>
                <thead>
                  <tr>
                    <th>Membership Type</th>
                    <th>Point balance added per Rs.100</th>
                    <th>Expiry (months)</th>
                    <th>Charges</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {fetchedRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.program_type}</td>
                      <td>{row.points_hold}</td>
                      <td>{row.expiry_duration}</td>
                      <td>{row.price}</td>
                      <td>
                      <DeleteIcon 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => handleDelete(row.id)}
                      />
                    </td>
                    </tr>
                  ))}
                  {newRows.map((row, index) => (
                    <tr key={`new-${index}`}>
                      <td
                        contentEditable
                        onBlur={(e) => handleInputChange(index, 'type', e.target.innerText)}
                      >
                        {row.type}
                      </td>
                      <td
                        contentEditable
                        onBlur={(e) => handleInputChange(index, 'points', e.target.innerText)}
                      >
                        {row.points}
                      </td>
                      <td
                        contentEditable
                        onBlur={(e) => handleInputChange(index, 'expiry', e.target.innerText)}
                      >
                        {row.expiry}
                      </td>
                      <td
                        contentEditable
                        onBlur={(e) => handleInputChange(index, 'charges', e.target.innerText)}
                      >
                        {row.charges}
                      </td>
                      <td>
                        {
                          loading ? <CircularProgress size={24} /> :
                          <SaveIcon onClick={handleSave} style={{ cursor: 'pointer' }} />
                        }
                      </td>
                    </tr>
                  ))}
                 
                </tbody>
              </table>
              <div className='clp_add_row' style={{ cursor: 'pointer' }} onClick={handleAddRow}>
                <AddIcon />
                <span>Add Row</span>
              </div>
              <div className='clp_threshold_container'>
                <label htmlFor='threshold'>Set Minimum Amount:</label>
                <input
                  type='number'
                  id='threshold'
                  value={threshold}
                  onChange={handleThresholdChange}
                  className='clp_threshold_input'
                  placeholder='Enter amount'
                />
              </div>
              <button  className='save_button'  onClick={handleThresholdSave}>
              {loading ? <CircularProgress size={24} /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CLP_Setting;
