import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header.js';
import SearchIcon from '@mui/icons-material/Search';
import VertNav from './VertNav.js';
import { Helmet } from 'react-helmet';
import EditAppointment from './EditAppointment.js';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditIcon from '@mui/icons-material/Edit';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import config from '../../config.js';
import '../Styles/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [originalBillData, setOriginalBillData] = useState([]);
  const [filteredBillData, setFilteredBillData] = useState([]);
  const [searchBillTerm, setSearchBillTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadAppointment, setLoadAppointment] = useState(true);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const bid = localStorage.getItem('branch_id');

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${config.apiUrl}/api/swalook/appointment/?branch_name=${bid}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setOriginalData(response.data.table_data);
        setFilteredData(response.data.table_data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoadAppointment(false);
      }
    };

    fetchAppointments();
  }, [bid]);

  useEffect(() => {
    const fetchBilling = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${config.apiUrl}/api/swalook/billing/?branch_name=${bid}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setOriginalBillData(response.data.table_data);
        setFilteredBillData(response.data.table_data);
      } catch (error) {
        console.error('Error fetching billing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, [bid]);

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredRows = originalData.filter(row =>
      row.customer_name.toLowerCase().includes(term) ||
      row.booking_date.toLowerCase().includes(term) ||
      row.services.toLowerCase().includes(term) ||
      row.mobile_no.toLowerCase().includes(term)
    );
    setFilteredData(filteredRows);
  };

  const handleBillSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchBillTerm(term);
    const filteredBillRows = originalBillData.filter(row =>
      row.customer_name.toLowerCase().includes(term) ||
      row.mobile_no.toLowerCase().includes(term) ||
      row.grand_total.toString().toLowerCase().includes(term) ||
      row.services.toLowerCase().includes(term)
    );
    setFilteredBillData(filteredBillRows);
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowEditPopup(true);
  };

  const handleShowInvoice = (id) => {
    navigate(`/viewinvoice/${id}`);
  };

  const handleDeleteClick = async (id) => {
    console.log("Delete clicked for id:", id);
  };

  return (
    <div className='admin-dashboard'>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <Header />
      <div className='dashboard-container'>
        <VertNav />
        <div className={`main-content`}>
          {/* Appointment Table */}
          <div className="table-section">
            <div className="section-header">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search Appointments..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <h2>Appointments</h2>
            </div>
            <div className='table-container'>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Services</th>
                    <th>Mobile No</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadAppointment ? (
                    <tr>
                      <td colSpan="5" className="loading-cell">
                        <CircularProgress />
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row) => (
                      <tr key={row.id}>
                        <td>{row.customer_name}</td>
                        <td>{row.booking_date}</td>
                        <td>{row.services.split(',').join(', ')}</td>
                        <td>{row.mobile_no}</td>
                        <td className="action-cell">
                          <Tooltip title="Edit Appointment" arrow>
                            <EditIcon onClick={() => handleEditClick(row)} />
                          </Tooltip>
                          <Tooltip title="Delete Appointment" arrow>
                            <DeleteIcon onClick={() => handleDeleteClick(row.id)} />
                          </Tooltip>
                          <Tooltip title="Generate Invoice" arrow>
                            <ArrowCircleRightIcon onClick={() => handleShowInvoice(row.id)} />
                          </Tooltip>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <p>Total Appointments: {filteredData.length}</p>
            </div>
          </div>

          {/* Billing Table */}
          <div className="table-section">
            <div className="section-header">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search Billing..."
                  value={searchBillTerm}
                  onChange={handleBillSearchChange}
                />
              </div>
              <h2>Billing Table</h2>
            </div>
            <div className='table-container'>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Mobile No</th>
                    <th>Billing Amount</th>
                    <th>Date</th>
                    <th>Services</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="loading-cell">
                        <CircularProgress />
                      </td>
                    </tr>
                  ) : (
                    filteredBillData.map((row) => (
                      <tr key={row.id}>
                        <td>{row.customer_name}</td>
                        <td>{row.mobile_no}</td>
                        <td>{row.grand_total}</td>
                        <td>{row.date}</td>
                        <td>
                          {Array.isArray(row.services) 
                            ? row.services.map(service => service.Description).join(', ') 
                            : 'No services available'}
                        </td>
                        <td className="action-cell">
                          <Tooltip title="View Invoice" arrow>
                            <PictureAsPdfIcon onClick={() => handleShowInvoice(row.id)} />
                          </Tooltip>
                          <Tooltip title="Share via WhatsApp" arrow>
                            <AiOutlineWhatsApp style={{ fontSize: "24px" }} />
                          </Tooltip>
                          <Tooltip title="Delete Bill" arrow>
                            <DeleteIcon onClick={() => handleDeleteClick(row.id)} />
                          </Tooltip>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <p>Total Billing Records: {filteredBillData.length}</p>
            </div>
          </div>

          {/* Edit Appointment Popup */}
          {showEditPopup && (
            <EditAppointment
              appointment={selectedAppointment}
              onClose={() => setShowEditPopup(false)}
            />
          )}
        </div>
      </div>

      {/* Bottom Slider */}
      <div className="bottom-slider">
        <p>Additional Information or Controls Here</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
