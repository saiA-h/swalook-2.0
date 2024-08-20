import React, { useState } from 'react';
import '../Styles/EditServicePopup.css';
import axios from 'axios';
import Popup from './Popup';
import config from '../../config';

function EditServicePopup({ onClose, serviceData }) {
    const [serviceN , setServiceN] = useState(''); // Original service name
    const [serviceDuration, setServiceDuration] = useState('');
    const [servicePrice, setServicePrice] = useState('');
    const [showPopup, setShowPopup] = useState(false); 
    const [popupMessage, setPopupMessage] = useState('');

    console.log(serviceData);
    console.log(serviceData.id);
    console.log(serviceData.serviceName);

    const bid = localStorage.getItem('branch_id');

    // Function to handle saving the edited service
    const handleSaveService = (e) => {
        e.preventDefault();
        
        // Prepare the data for the POST request
        const token = localStorage.getItem('token');
        const data = {
            service: serviceN, // Original service name
            service_price: servicePrice, // Updated service price
            service_duration: serviceDuration // Updated service duration
        };

        // Perform the POST request
        axios.put(`${config.apiUrl}/api/swalook/edit/services/?branch_name=${bid}&id=${serviceData.id}`, data, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            console.log(res.data);
            console.log("Service edited");
            setPopupMessage("Service edited successfully!");
            setShowPopup(true);
            // alert("Service edited successfully!");
            onClose(); // Close the popup after successful editing
            window.location.reload(); // Reload the page to reflect the changes
        })
        .catch((err) => {
            setPopupMessage("Failed to edit service.");
            setShowPopup(true);
            console.log(err);
        });
    };

    return (
        <div className="popup_overlay">
            <div className="popup_container">
                <div className="popup_header">
                    <div className='pph3'>
                        <h3>Edit Service</h3>
                    </div>
                    <button className="close_button" onClick={onClose}>X</button>
                </div>
                <hr></hr>
                <form onSubmit={handleSaveService}> {/* Add onSubmit event handler */}
                    <div className="sn1">
                        <label htmlFor="service_name">Service Name:</label>
                        <input type="text" id="service_name" name="service_name" placeholder='Service Name' defaultValue={serviceData.serviceName} onChange={(e)=> setServiceN(e.target.value)} />
                    </div>
                    <div className="sn2">
                        <label htmlFor="duration">Duration:</label>
                        <input type="text" id="duration" name="duration" placeholder="Duration (min)"  onChange={(e) => setServiceDuration(e.target.value)} />
                    </div>
                    <div className="sn3">
                        <label htmlFor="price">Price:</label>
                        <input type="text" id="price" name="price" placeholder="Price" onChange={(e) => setServicePrice(e.target.value)} />
                    </div>
                    <div className="sn_button_container">
                        <button type="submit" className="sn_save_button">Save</button> {/* Change button type to submit */}
                    </div>
                </form>
            </div>
            {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
        </div>
    );
}

export default EditServicePopup;
