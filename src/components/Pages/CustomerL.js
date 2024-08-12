import React, { useState, useEffect } from 'react';
import '../Styles/CustomerL.css';
import Header from './Header';
import Loyal from '../../assets/Loyalty.png';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AddCustomerPopup from './AddCustomerPopup';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import config from '../../config';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditCustomerPopup from './EditCustomerPopup';

function CustomerL() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [customerData, setCustomerData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);


    const handleAddCustomerClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleEditClick = (customer) => {
        setSelectedCustomer(customer);
        setIsEditPopupOpen(true);
    };

    const handleEditPopupClose = () => {
        setIsEditPopupOpen(false);
        setSelectedCustomer(null);
    };

    const bname = localStorage.getItem('branch_name');
    const token = localStorage.getItem('token');

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${config.apiUrl}/api/swalook/loyality_program/delete/customer/?id=${id}`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            // Refresh data after deletion
            const response = await axios.get(`${config.apiUrl}/api/swalook/loyality_program/view/customer/?branch_name=${atob(bname)}`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            if (response.data.status) {
                setCustomerData(response.data.data);
                setFilteredData(response.data.data);
            }
        } catch (error) {
            console.error('An error occurred while deleting customer data:', error);
        }
    };

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/api/swalook/loyality_program/view/customer/?branch_name=${atob(bname)}`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                if (response.data.status) {
                    setCustomerData(response.data.data);
                    setFilteredData(response.data.data);
                }
            } catch (error) {
                console.error('An error occurred while fetching customer data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [bname, token]);

    useEffect(() => {
        const search = searchQuery.toLowerCase();
        const filtered = customerData.filter(customer =>
            customer.name.toLowerCase().includes(search) || customer.mobile_no.includes(search)
        );
        setFilteredData(filtered);
    }, [searchQuery, customerData]);
        

    return (
        <div className='cl_container'>
            <Helmet>
                <title>Customer Loyalty</title>
            </Helmet>
            <Header />
            <div className='cl_main'>
                <div className='cl_left'>
                    <img src={Loyal} alt='Customer' className='cl_image'/>
                </div>
                <div className='cl_right'>
                    <div className='cl_card cl_add' onClick={handleAddCustomerClick}>
                        <PersonAddIcon style={{ fontSize: "32px" }} className='cl_icon' />
                        <span className='cl_cardText'>Add Customer</span>
                    </div>
                    {/* <div className='cl_card cl_delete'>
                        <PersonRemoveIcon style={{ fontSize: "32px" }} className='cl_icon' />
                        <span className='cl_cardText'>Delete Customer</span>
                    </div> */}
                </div>
            </div>
            <div className='cl_tableContainer'>
                <div className='cl_headerContainer'>
                    <h2 className='cl_heading'>Customer Details</h2>
                    <input
                        className='cl_searchBar'
                        placeholder='Search Customer...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <hr className='cl_divider'/>
                <div className='cl_table_wrapper'>
                    <table className='cl_table'>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "center" }}>S.No</th>
                                <th style={{ textAlign: "center" }}>Customer Name</th>
                                <th style={{ textAlign: "center" }}>Customer Number</th>
                                <th style={{ textAlign: "center" }}>Loyalty Programme</th>
                                <th style={{ textAlign: "center" }}>Points Gathered</th>
                                <th style={{ textAlign: "center" }}>Days Until Expiry</th>
                                <th style={{ textAlign: "center" }}>View</th>
                                <th style={{ textAlign: "center" }}>Edit</th>
                                <th style={{ textAlign: "center" }}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7">Loading...</td>
                                </tr>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((customer, index) => (
                                    <tr key={customer.id}>
                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                        <td style={{ textAlign: "center" }}>{customer.name}</td>
                                        <td style={{ textAlign: "center" }}>{customer.mobile_no}</td>
                                        <td style={{ textAlign: "center" }}>{customer.membership}</td>
                                        <td style={{ textAlign: "center" }}>{customer.loyality_profile.current_customer_points}</td>
                                        <td style={{ textAlign: "center" }}>
                                            {customer.loyality_profile.expire_date}
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <PreviewIcon style={{ cursor: 'pointer' }} />
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <EditIcon style={{ cursor: 'pointer' }}  onClick={() => handleEditClick(customer)}
                                            />
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => handleDelete(customer.id)} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isPopupOpen && <AddCustomerPopup onClose={handleClosePopup} />}
            {isEditPopupOpen && (
                <EditCustomerPopup
                    customer={selectedCustomer}
                    onClose={handleEditPopupClose}
                />
            )}
        </div>
    );
}

export default CustomerL;
