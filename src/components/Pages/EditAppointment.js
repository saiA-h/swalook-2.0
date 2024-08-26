import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import '../Styles/EditAppointment.css';
import axios from 'axios';
import Popup from './Popup';
import config from '../../config';

function EditAppointment({ onClose, appointmentId, appointmentName, appointmentPhone }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [booking_date, setBookingDate] = useState('');
    const [booking_time, setBookingTime] = useState('');
    const [selectedAMPM, setSelectedAMPM] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [comments, setComments] = useState('');

    const handleEditClose = () => {
        document.body.classList.remove('no-scroll');
        onClose();
    };

    const [services, setServices] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([]);

    const bid = localStorage.getItem('branch_id');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const servicesResponse = await fetch(`${config.apiUrl}/api/swalook/table/services/?branch_name=${bid}`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const servicesData = await servicesResponse.json();
                setServiceOptions(servicesData.data.table_data.map((service) => {
                    return { value: service.service }
                }));

                const appointmentResponse = await fetch(`${config.apiUrl}/api/swalook/get_specific/appointment/${appointmentId}/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const appointmentData = await appointmentResponse.json();
                const appointment = appointmentData.single_appointment_data[0];
                setEmail(appointment.email);
                setBookingDate(appointment.booking_date);
                setBookingTime(appointment.booking_time);
                setComments(appointment.comment);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
        document.body.classList.add('no-scroll'); // Disable scrolling when the component mounts

        return () => {
            document.body.classList.remove('no-scroll'); // Enable scrolling when the component unmounts
        };
    }, [appointmentId]);

    const handleSelect = (selectedList) => {
        setServices(selectedList);
    };

    const handleTimeChange = (event) => {
        const { id, value } = event.target;

        switch (id) {
            case 'hours':
                setBookingTime(prevTime => `${value || ''}:${prevTime.split(':')[1] || '00'} ${selectedAMPM}`);
                break;
            case 'minutes':
                setBookingTime(prevTime => `${prevTime.split(':')[0] || ''}:${value || '00'} ${selectedAMPM}`);
                break;
            case 'am_pm':
                setSelectedAMPM(value || '');
                setBookingTime(prevTime => `${prevTime.split(':')[0] || ''}:${prevTime.split(':')[1] || '00'} ${value || ''}`);
                break;
            default:
                break;
        }
    };

    const bname = atob(localStorage.getItem('branch_name'));
    const sname = localStorage.getItem('s-name');

    const handleEditAppointment = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${config.apiUrl}/api/swalook/edit/appointment/${appointmentId}/`, {
                customer_name: appointmentName,
                mobile_no: appointmentPhone,
                email: email,
                services: services.map(service => service.value).join(', '),
                booking_date: booking_date,
                booking_time: booking_time,
                vendor_branch: bname,
                comment: comments
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setPopupMessage("Appointment edited successfully!");
            setShowPopup(true);
            onClose();
            navigate(`/${sname}/${bname}/dashboard`);
            window.location.reload();
        } catch (err) {
            setPopupMessage("Failed to edit appointment.");
            setShowPopup(true);
            console.log(err);
        }
    };

    return (
        <div>
            <div className="edit_popup_overlay">
                <div className="edit_popup_container">
                    <div className="edit_popup_header">
                        <h3>Edit Appointment</h3>
                        <button className="edit_close_button" onClick={handleEditClose}>X</button>
                    </div>
                    <hr />
                    <form onSubmit={handleEditAppointment}>
                        <div className="edit-appointform-group">
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" className="edit-appoint_input-field" placeholder='Enter Full Name' value={appointmentName} required readOnly />
                        </div>
                        <div className="edit-appointform-group">
                            <label htmlFor="phone">Phone:</label>
                            <input type="number" id="phone" className="edit-appoint_input-field" placeholder='Enter Mobile Number' value={appointmentPhone} required readOnly maxLength={10} />
                        </div>
                        <div className="edit-appointform-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" className="edit-appoint_input-field" placeholder='Enter Email Address' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <h3 className='sts'>Select the Service</h3>
                        <div className='edit-appoint_select-field-cont'>
                            <Multiselect
                                options={serviceOptions}
                                showSearch={true}
                                onSelect={handleSelect}
                                onRemove={handleSelect}
                                displayValue="value"
                                placeholder="Select Services...."
                                className="appoint_select-field"
                                showCheckbox={true}
                            />
                        </div>
                        <div className="edit-appointform-group">
                            <label htmlFor="comment">Comment:</label>
                            <input type="text" id="comment" className="edit-appoint_input-field" value={comments} rows={2} onChange={(e) => setComments(e.target.value)} placeholder='Enter Comment' />
                        </div>
                        <h3 className='sch'>Schedule</h3>
                        <div className="edit-schedule_form-group">
                            <label htmlFor="date" className="edit-schedule_date-label">Date:</label>
                            <input type='date' id='date' className='edit-schedule_date-input' value={booking_date} onChange={(e) => setBookingDate(e.target.value)} />
                        </div>
                        <div className="edit-schedule_time-selection">
                            <label htmlFor="hours" className="edit-schedule_time-label">Time:</label>
                            <select id="hours" className="edit-schedule_time-dropdown" onChange={handleTimeChange}>
                                <option value="" disabled>Hours</option>
                                {[...Array(12).keys()].map(hour => (
                                    <option key={hour + 1} value={hour + 1}>{hour + 1}</option>
                                ))}
                            </select>
                            <select id="minutes" className="edit-schedule_time-dropdown" onChange={handleTimeChange}>
                                <option value="" disabled>Minutes</option>
                                <option value="00">00</option>
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="45">45</option>
                            </select>
                            <select id="am_pm" className="edit-schedule_time-dropdown" onChange={handleTimeChange}>
                                <option value="" disabled>AM/PM</option>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                        <div className="edit-appoint-button-container">
                            <button className="edit-appoint_submit-button">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
        </div>
    );
}

export default EditAppointment;
