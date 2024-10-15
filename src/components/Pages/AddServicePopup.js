import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/AddServicePopup.css';
import axios from 'axios';
import Popup from './Popup';
import config from '../../config';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'; // Import the icon

function AddServicePopup({ onClose }) {
    const navigate = useNavigate();
    const [service, setService] = useState('');
    const [service_price, setServicePrice] = useState('');
    const [service_duration, setServiceDuration] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const branchName = localStorage.getItem('branch_name');
    const sname = localStorage.getItem('s-name');
    const bid = localStorage.getItem('branch_id');

    const handleAddService = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        axios.post(`${config.apiUrl}/api/swalook/add/services/?branch_name=${bid}`, {
            service: service,
            service_price: service_price,
            service_duration: service_duration
        }, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            setPopupMessage("Service added successfully!");
            setShowPopup(true);
            onClose();
            window.location.reload();
        })
        .catch((err) => {
            setPopupMessage("Failed to add service.");
            setShowPopup(true);
        });
    };

    return (
        <div className="popup_overlay">
            <div className="popup_container">
                <div className="popup_header">
                    <h3 className='pph3'>Add Service</h3>
                    <button className="close_button" onClick={onClose}>
                        <HighlightOffOutlinedIcon />
                    </button>
                </div>
                <hr />
                <form onSubmit={handleAddService}>
                    <div className="sn1">
                        <label htmlFor="service_name">Service Name:</label>
                        <input type="text" id="service_name" name="service_name" placeholder='Service Name' required onChange={(e) => setService(e.target.value)} />
                    </div>
                    <div className="sn2">
                        <label htmlFor="duration">Duration:</label>
                        <input type="number" id="duration" name="duration" placeholder="Duration (min)" required onChange={(e) => setServiceDuration(e.target.value)} />
                    </div>
                    <div className="sn3">
                        <label htmlFor="price">Price:</label>
                        <input type="number" id="price" name="price" placeholder="Price" required onChange={(e) => setServicePrice(e.target.value)} />
                    </div>
                    <div className="sn_button_container">
                        <button className="sn_save_button">Save</button>
                    </div>
                </form>
            </div>
            {showPopup && <Popup message={popupMessage} onClose={() => { setShowPopup(false); navigate(`/${sname}/${branchName}/service`); }} />}
        </div>
    );
}

export default AddServicePopup;
