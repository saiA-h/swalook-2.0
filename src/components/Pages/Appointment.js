import React, {useState , useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import '../Styles/Appointment.css'
import Header from './Header'
import VertNav from './VertNav'
import Popup from './Popup';
import { Helmet } from 'react-helmet';
import config from '../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import CustomDialog from './CustomDialog';

function getCurrentDate() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}

function Appointment() {
  const navigate = useNavigate();
  const currentDate = getCurrentDate();
  const [services, setServices] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [customer_name, setCustomerName] = useState('');
  const [mobile_no , setMobileNo] = useState('');
  const [email , setEmail] = useState('');
  // const booking_date = currentDate;
  const [booking_date, setBookingDate] = useState('');
  const [booking_time, setBookingTime] = useState('');
  const [selectedAMPM, setSelectedAMPM] = useState('');
  const [getPresetDayAppointment, setGetPresetDayAppointment] = useState([]);
  const [showPopup, setShowPopup] = useState(false); 
  const [popupMessage, setPopupMessage] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookAppointment, setBookAppointment] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [dialogTitle, setDialogTitle] = useState(''); // State for dialog title
  const [dialogMessage, setDialogMessage] = useState(''); // State for dialog message

  const bid = localStorage.getItem('branch_id');
  console.log(`Branch ID: ${bid}`);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.apiUrl}/api/swalook/table/services/?branch_name=${bid}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          method: 'GET'
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
       
  
        setServiceOptions(data.data.table_data.map((service) => ({
          key: service.id, 
          value: service.service
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleSelect = (selectedList) => {
    setServices(selectedList);
  };

  // const handleTimeChange = (event) => {
  //   const { id, value } = event.target;

  //   switch (id) {
  //     case 'hours':
  //       setBookingTime(prevTime => `${value}:${prevTime.split(':')[1] || '00'} ${prevTime.split(' ')[1] || 'AM'}`);
  //       break;
  //     case 'minutes':
  //       setBookingTime(prevTime => `${prevTime.split(':')[0] || '12'}:${value} ${prevTime.split(' ')[1] || 'AM'}`);
  //       break;
  //     case 'am_pm':
  //       setBookingTime(prevTime => `${prevTime.split(':')[0] || '12'}:${prevTime.split(':')[1] || '00'} ${value}`);
  //       break;
  //     default:
  //       break;
  //   }
  // };

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

  console.log(booking_time);
  console.log(booking_date);

  const handleAddAppointment = async (e) => {
    setBookAppointment(true);
    e.preventDefault();
    if (services.length === 0) {
      setDialogTitle('Error');
      setDialogMessage('Please select at least one service.');
      setDialogOpen(true);
      setBookAppointment(false);
      return;
    }
  
    if (booking_time === '') {
      setDialogTitle('Error');
      setDialogMessage('Please select time');
      setDialogOpen(true);
      setBookAppointment(false);
      return;
    }

    if (booking_date === '') {
      setDialogTitle('Error');
      setDialogMessage('Please select date');
      setDialogOpen(true);
      setBookAppointment(false);
      return;
    }

    const mobileNoPattern = /^[0-9]{10}$/;
    if(!mobileNoPattern.test(mobile_no)) {
      setDialogTitle('Error');
      setDialogMessage('Please enter a valid mobile number.');
      setDialogOpen(true);
      setBookAppointment(false);
      return;
    }
  
    console.log(customer_name, mobile_no, email, booking_date, booking_time, services);
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(`${config.apiUrl}/api/swalook/appointment/?branch_name=${bid}`, {
        customer_name: customer_name,
        mobile_no: mobile_no,
        email: email,
        services: services.map(service => service.value).toString(),
        booking_time: booking_time,
        booking_date: booking_date,
        comment: comments,
      }, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      

      if(response.status === 200) {
        
        setPopupMessage("Appointment added successfully!"); // Set popup message
        setShowPopup(true);

        const phoneNumber = mobile_no; 
        const serviceNames = services.map(service => service.value).join(', '); 
        const message = `Hi ${customer_name}!\nYour appointment is booked and finalised for: ${booking_time} | ${booking_date}\nFor the following services: ${serviceNames}\nSee you soon!\nThanks and Regards\nTeam ${atob(branchName)}`;
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappLink, '_blank'); 
      }
    } catch (error) {
      setPopupMessage("Failed to add appointment!"); // Set popup message for failure
      setShowPopup(true);
      console.error('Failed to add appointment:', error);
      // alert("Failed to add appointment!");
    } finally {
      setBookAppointment(false);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiUrl}/api/swalook/preset-day-appointment/?branch_name=${bid}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        console.log(response.data.table_data);
        setGetPresetDayAppointment(response.data.table_data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const branchName = localStorage.getItem('branch_name');
  const sname = localStorage.getItem('s-name');

  const handleDeleteAppoint = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`${config.apiUrl}/api/swalook/delete/appointment/?id=${id}&branch_name=${bid}`, {
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
  const [deleteInvoiceId, setDeleteInvoiceId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteInvoiceId(id);
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${config.apiUrl}/api/swalook/delete/appointment/${deleteInvoiceId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(res.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    } finally {
      setShowDeletePopup(false);
    }
  };

  const handleArrowClick = (row) => {
    navigate(`/${sname}/${branchName}/generatebil`, { state: { rowData: row } });
  };

  return (
    <div className='appoint_dash_main'>
      <Helmet>
        <title>Book Appointment</title>
      </Helmet>
      <Header />
      <div className='appoint_horizontal'>
      <div className='appoint_h1'>
        <div className='appoint_ver_nav'>
          <VertNav />
        </div>
      </div>
      <div class='appoint_h2'>
        <div class='appoint_left'>
        <form onSubmit={handleAddAppointment}>
        <h2 className='h_appoint'>Book Appointment</h2>
        <hr className='appoint_hr'/>
        <div className='ba_con'>
        <h3 className='cd'>Customer Details</h3>
        <div className='app'>
        <div className="appointform-group appoint-text">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" className="appoint_input-field" placeholder='Enter Full Name' required  onChange={(e)=> setCustomerName(e.target.value)}/>
        </div>
        <div className="appointform-group appoint-email">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" className="appoint_input-field" placeholder='Enter Email Address' onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div className="appointform-group appoint-phone">
                <label htmlFor="phone">Phone:</label>
                <input type="number" id="phone" className="appoint_input-field" placeholder='Enter Mobile Number' required onChange={(e)=>setMobileNo(e.target.value )} maxLength={10}/>
        </div>
        </div>
        <h3 className='sts'>Select the Service</h3>
        <div className='appoint_select-field-cont'>
          <div className='ss'>
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
            </div>
            <div className="appointform-group" style={{ marginTop: '10px' }}>
                    <label htmlFor="comments">Comment:</label>
                <input id="comments" type='text' className="appoint_input-field" placeholder='Enter Comments' onChange={(e) => setComments(e.target.value)}></input>
            </div>
        <h3 className='sch'>Schedule</h3>
        </div>   
        <div className='ap-p-parent'>
        <div className='ap-p'>
        <div className="schedule_form-group">
                <label htmlFor="date" className="schedule_date-label">Date:</label>
                {/* <input type="text" id="date" className="schedule_date-input" value={currentDate} readOnly /> */}
                <input type='date' id='date' className='schedule_date-input' onChange={(e) => setBookingDate(e.target.value)} />
              </div>
              
              <div className="schedule_time-selection">
                <label htmlFor="hours" className="schedule_time-label">Time:</label>
                <select id="hours" className="schedule_time-dropdown" onChange={handleTimeChange}>
                  <option value="" disabled selected>Hours</option>
                  {[...Array(12).keys()].map(hour => (
                    <option key={hour + 1} value={hour + 1}>{hour + 1}</option>
                  ))}
                </select>
                <select id="minutes" className="schedule_time-dropdown" onChange={handleTimeChange}>
                  <option value="" disabled selected>Minutes</option>
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
                <select id="am_pm" className="schedule_time-dropdown" onChange={handleTimeChange}>
                  <option value="" disabled selected>AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              </div>
              </div>
              <div className="appoint-button-container">
              <button className="appoint_submit-button">
                {bookAppointment ? <CircularProgress size={20} color="inherit"/> : 'Submit'}
              </button>
              </div>
              </form>
        </div>
        <div class='appoint_right'>
        <h2 className='h_appoint'>Booked Appointments:({currentDate})</h2>
        <hr className='appoint_hr'/>
        <div class='appoint_table_wrapper'>
        <table class='appoint_table'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Mobile No.</th>
                    <th>Time</th>
                    <th>Services</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                  loading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>
                        <CircularProgress />
                      </td>
                    </tr>
                  ) :getPresetDayAppointment.map((row) => (
                    <tr key={row.id}>
                        <td>{row.customer_name}</td>
                        <td>{row.mobile_no}</td>
                        <td>{row.booking_time}</td>
                        <td>
                          {row.services.split(',').length > 1 ? (
                            <select className='status-dropdown'>
                              {row.services.split(',').map((service, index) => (
                                <option key={index} value={service}>{service}</option>
                              ))}
                            </select>
                          ) : row.services.split(',')[0]}
                        </td>
                        <td>
                          <select
                            className="status-dropdown"
                            // value={row.status}
                            // onChange={(e) => handleStatusChange(e, row.id)}
                          >
                            <option value="pending" selected>Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        {/* <td>
                            <DeleteIcon onClick={() => handleDeleteAppoint(row.id)} style={{cursor:"pointer"}}/>
                        </td> */}

<td>
<Tooltip title="Delete Appointment" arrow>
        <DeleteIcon
          onClick={() => handleDeleteClick(row.id)}
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
      </div>
      {showPopup && <Popup message={popupMessage} onClose={() => { setShowPopup(false); navigate(`/${sname}/${branchName}/dashboard`); }} />}

      {showDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this appointment?</p>
            <div className="popup-buttons">
              <button onClick={handleDeleteConfirm}>Yes</button>
              <button onClick={() => setShowDeletePopup(false)}>No</button>
            </div>
          </div>
        </div>
      )}

<CustomDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={dialogTitle}
        message={dialogMessage}
      />
    </div>
  )
}

export default Appointment;