import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Header.js';
import '../../components/Styles/AdminDashboard.css';
import SearchIcon from '@mui/icons-material/Search';
import VertNav from './VertNav.js';
import { Helmet } from 'react-helmet';
import EditAppointment from './EditAppointment.js';
import { useNavigate } from 'react-router-dom';
import config from '../../config.js';
import Cookies from 'js-cookie';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditIcon from '@mui/icons-material/Edit';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

function AdminDashboard() {
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [saloonName, setSaloonName] = useState('');
  const bname = atob(localStorage.getItem('branch_name'));
  const bra = Cookies.get('branch_n');
  const [orginalBillData, setOriginalBillData] = useState([]);
  const [filteredBillData, setFilteredBillData] = useState([]);
  const [searchBillTerm, setSearchBillTerm] = useState('');
  const [serviceDescriptions, setServiceDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [load_appointment, setLoadAppointment] = useState(true);

  const branchName = localStorage.getItem('branch_name');
  const sname = localStorage.getItem('s-name');
  const userType = localStorage.getItem('type');

  const bid = localStorage.getItem('branch_id');
  console.log(bid);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiUrl}/api/swalook/appointment/?branch_name=${bid}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        console.log(response.data);
        setOriginalData(response.data.table_data);
        setFilteredData(response.data.table_data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadAppointment(false);
      }
    };
  
    fetchData();
  }, []);
  

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const filteredRows = originalData.filter(row =>
      row.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.booking_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.services.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mobile_no.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredRows);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiUrl}/api/swalook/billing/?branch_name=${bid}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        console.log(response.data);
        localStorage.setItem('saloon_name', response.data.salon_name);
        setSaloonName(localStorage.getItem('saloon_name'));
        setOriginalBillData(response.data.table_data);
        setFilteredBillData(response.data.table_data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const handleBillSearchChange = (event) => {
    const searchBillTerm = event.target.value;
    setSearchBillTerm(searchBillTerm);
    const filteredBillRows = orginalBillData.filter(row =>
      row.customer_name.toLowerCase().includes(searchBillTerm.toLowerCase()) ||
      row.mobile_no.toLowerCase().includes(searchBillTerm.toLowerCase()) ||
      row.grand_total.toLowerCase().includes(searchBillTerm.toLowerCase()) ||
      row.services.toLowerCase().includes(searchBillTerm.toLowerCase())
    );
    setFilteredBillData(filteredBillRows);
  }

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowEditPopup(true);
  };

  const handleShowInvoice = (id) => {
    navigate(`/${sname}/${branchName}/viewinvoice/${id}`);
  };

  const handleDeleteInvoice = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${config.apiUrl}/api/swalook/delete/invoice/${id}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(res.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteAppoint = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${config.apiUrl}/api/swalook/delete/appointment/${id}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(res.data);
      window.location.reload();
    }
    catch (err) {
      console.log(err);
    }
  }

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  const handleDeleteClick = (id, type) => {
    setDeleteId(id);
    setDeleteType(type);
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem('token');
    console.log(deleteId, deleteType);
    
    try {
      if (deleteType === 'appointment') {
        await axios.delete(`${config.apiUrl}/api/swalook/delete/appointment/?id=${deleteId}&branch_name=${bid}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else if (deleteType === 'invoice') {
        await axios.delete(`${config.apiUrl}/api/swalook/delete/invoice/?id=${deleteId}&branch_name=${bid}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    setShowDeletePopup(false);
  };

  const handleArrowClick = (row) => {
    navigate(`/${sname}/${branchName}/generatebil`, { state: { rowData: row } });
  };

  return (
    <div className='Admin_dash_main'>
      <Helmet>
      <title>{userType === 'staff' ? 'Staff Dashboard' : 'Admin Dashboard'}</title>
      </Helmet>
      <Header />
      <div className='horizontal-container'>
        <div className='vertical-navigation'>
          <div className='ver_nav'>
            <VertNav />
          </div>
        </div>
        <div className={`main-content ${userType === 'staff' ? 'blurred' : ''}`}>
          <div className="content-header">
          <h1 className="gradient-heading">
            Welcome, {bra}
          </h1>
            <div className="US_search-bar">
              <input
                type="text"
                placeholder="Search Appointments...."
                value={searchTerm}
                onChange={handleSearchChange}

                style={{fontFamily: "'Montserrat', sans-serif"}}
              />
              <SearchIcon className="US_search-icon" />
            </div>
          </div>

          <div className="content-body">
            
            <div className="content-box ">
              <Link to={`/${sname}/${branchName}/appointment`}>  
              <h3>Appointments</h3>
              </Link>
              <div className='US-con'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Services</th>
                      <th>Mobile No</th>
                      <th>Edit</th>
                      <th>Delete</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      load_appointment ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center" }}>
                            <CircularProgress />
                          </td>
                        </tr>
                      ) : filteredData.map((row) => (
                        <tr key={row.id}>
                          <td>{row.customer_name}</td>
                          <td>{row.booking_date}</td>
                          {/* <td>{row.services}</td> */}
                          <td>
                          {row.services.split(',').length > 1 ? (
                              <select className='status-dropdown'>
                                {row.services.split(',').map((service, index) => (
                                  <option key={index} value={service}>{service}</option>
                                ))}
                              </select>
                            ) : row.services.split(',')[0]}
                          </td>
  
                          <td>{row.mobile_no}</td>
                          <td>
                          <Tooltip title="Edit Appointment" arrow>
          <EditIcon
            onClick={() => handleEditClick(row)}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
                          
                          </td>
  
                          <td>  
                          <Tooltip title="Delete Appointment" arrow>
          <DeleteIcon
            onClick={() => handleDeleteClick(row.id, 'appointment')}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
                          </td>
  
                          <td>
                              <Tooltip title="Generate Invoice">
                                  <ArrowCircleRightIcon 
                                      onClick={() => handleArrowClick(row)} 
                                      style={{ cursor: "pointer" }}
                                  />
                              </Tooltip>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="content-footer">
            <div className="f_top">
              <Link to={`/${sname}/${branchName}/generatebill`}>
              <h3>Billing Table</h3>
              </Link>
              <div className="billing_search-bar">
                <input
                  type="text"
                  placeholder="Search Billing..."
                  className="search-Billing"
                  value={searchBillTerm}
                  onChange={handleBillSearchChange}
                />
                <SearchIcon className="billing_search-icon" />
              </div>
            </div>
            <div className='BT-con'>
            <table>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Mobile No</th>
                    <th>Billing Amount</th>
                    <th>Date</th>
                    <th>Services</th>
                    <th>View</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>{
                  loading ? ( <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      <CircularProgress />
                    </td>
                  </tr>) : filteredBillData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.customer_name}</td>
                      <td>{row.mobile_no}</td>
                      <td>{row.grand_total}</td>
                      <td>{row.date}</td>
                      
                      <td>

{(() => {
  try {
    const servicesArray = JSON.parse(row.services);
    if (servicesArray.length > 1) {
      return (
        <select className='status-dropdown'>
          {servicesArray.map((service, index) => (
            <option key={index} value={service.Description}>{service.Description}</option>
          ))}
        </select>
      );
    } else if (servicesArray.length === 1) {
     
      return <span>{servicesArray[0].Description}</span>;
    } else {
      return null;
    }
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null;
  }
})()}


                      </td>
                     
                      <td>
                      <Tooltip title="View Invoice" arrow>
        <PictureAsPdfIcon
          onClick={() => handleShowInvoice(row.id)}
          style={{ cursor: "pointer" }}
        />
      </Tooltip>
                         </td>
                     
                      <td>
                      <Tooltip title="Delete Invoice" arrow>
        <DeleteIcon
          onClick={() => handleDeleteClick(row.id, 'invoice')}
          style={{ cursor: "pointer" }}
        />
      </Tooltip>
                      </td>
                    </tr>
                  ))

                }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showEditPopup && <EditAppointment  appointment={selectedAppointment}
          onClose={() => setShowEditPopup(false)}
          appointmentId={selectedAppointment.id} // Pass the appointment ID as a prop
          appointmentName={selectedAppointment.customer_name} // Pass the appointment name as a prop
          appointmentPhone={selectedAppointment.mobile_no} />}

{showDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this {deleteType}?</p>
            <div className="popup-buttons">
              <button onClick={handleDeleteConfirm}>Yes</button>
              <button onClick={() => setShowDeletePopup(false)}>No</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
