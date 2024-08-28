import React, { useEffect, useState , useRef} from 'react';
import axios from 'axios';
import { json, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";
import '../Styles/Invoice.css';
import Logo1 from '../../assets/S_logo.png'
import numberToWords from '../Pages/NumberToWords';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Popup from './Popup';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { CircularProgress } from '@mui/material';
import { storage } from '../../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Invoice() {

  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false); 
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const bid = localStorage.getItem('branch_id');

  // const handlePrint = () => {
  //   const capture = document.querySelector('.invoice_main');
  //   const margin = 10; // Adjust margin size as needed
  //   const pageWidth = 300; // A4 page width in mm
  //   const increasedWidth = pageWidth + (2 * margin); // Increased width with margins
  
  //   html2canvas(capture).then(canvas => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF('p', 'mm', [increasedWidth, 297]); // [width, height]
  //     const componentWidth = pdf.internal.pageSize.getWidth();
  //     const componentHeight = pdf.internal.pageSize.getHeight();
  
      
  //     const posX = margin;
  //     const posY = margin;
  //     const imgWidth = componentWidth - (2 * margin);
  //     const imgHeight = componentHeight - (2 * margin);
  
  //     pdf.addImage(imgData, 'PNG', posX, posY, imgWidth, imgHeight);
  //     pdf.save(`Invoice${getInvoiceId}.pdf`);
  //   });
  // };
  
  const location = useLocation();
  const getCurrentDate = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const currentDate = new Date();
    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  const isGST = location.state.isGST;
  const customer_name = location.state.customer_name;
  const mobile_no = location.state.mobile_no;
  const email = location.state.email;
  const services = location.state.GBselectedServices;
  const address = location.state.address;
  const service_by = location.state.service_by;
  const discount = location.state.discount;
  const gst_number = location.state.gst_number;
  const comments = location.state.comments;
  const invoiceId = location.state.InvoiceId;
  const producData = location.state.productData ? location.state.productData : [];
  // const deductedPoint = location.state.deductedPoints ? location.state.deductedPoints : 0;

  // const deductedPoint = 0;
  const [deductedPoint, setDeductedPoint] = useState(0);

  const initialPrices = services.map(service => parseFloat(service.finalPrice));
  const [prices, setPrices] = useState(initialPrices);

  // const [prices, setPrices] = useState(Array(services.length).fill(services.map(service => service.price)));
  // const [quantities, setQuantities] = useState(Array(services.length).fill(1));

  const initialQuantity = services.map(service => parseFloat(service.inputFieldValue));
  const [quantities, setQuantities] = useState(initialQuantity);

  

  const [discounts, setDiscounts] = useState(Array(services.length).fill(discount));
  const [taxes, setTaxes] = useState(Array(services.length).fill(0));
  const [cgst, setCGST] = useState(Array(location.state.GBselectedServices.length).fill(0));
  const [sgst, setSGST] = useState(Array(location.state.GBselectedServices.length).fill(0));
  const [totalAmts, setTotalAmts] = useState(Array(location.state.GBselectedServices.length).fill(0));

  const [total_prise, setTotalPrice] = useState(0);
  const [total_quantity, setTotalQuantity] = useState(0);
  const [total_discount, setTotalDiscount] = useState(0);
  const [total_tax, setTotalTax] = useState(0);
  const [total_cgst, setTotalCGST] = useState(0);
  const [total_sgst, setTotalSGST] = useState(0);
  const [grand_total, setGrandTotal] = useState(0);

  const [invoice , setInvoice] = useState([]);

  const grandTotalInWords = numberToWords(parseFloat(grand_total - deductedPoint));

useEffect(() => {
  // Calculate and set total price
  const totalPrice = prices.reduce((acc, price) => acc + parseFloat(price), 0);
  setTotalPrice(totalPrice);
  

  // Calculate and set total quantity
  const totalQuantity = quantities.reduce((acc, quantity) => acc + parseFloat(quantity), 0);
  setTotalQuantity(totalQuantity);

  // Calculate and set total discount
  const totalDiscount = discounts.reduce((acc, discount) => acc + parseFloat(discount), 0);
  setTotalDiscount(totalDiscount);

  // Calculate and set taxes, cgst, and sgst
  const updatedTaxes = prices.map((price, index) => {
    const currPrice = (price * quantities[index]) - discounts[index];
    // const gst_value = (currPrice * 5) / 105;
    // const taxAmount = currPrice - gst_value;

    let taxAmount = 0; // Initialize tax amount to zero

    // if (isGST) {
    //   const gst_value = (currPrice * 5) / 105;
    //   taxAmount = currPrice - gst_value;
    // }

    if (services[index].gst !== "No GST") {
      const gst_value = (currPrice * 18) / 100;
      taxAmount = gst_value;
    }

    // Calculate CGST and SGST for the current service
    // const cgstValue = (taxAmount * 2.5) / 100;
    // const sgstValue = (taxAmount * 2.5) / 100;

    const cgstValue = taxAmount / 2;
    const sgstValue = taxAmount / 2;

    // Update total CGST and SGST
    setCGST(prevCGST => {
      const updatedCGST = [...prevCGST];
      updatedCGST[index] = cgstValue.toFixed(2);
      return updatedCGST;
    });

    setSGST(prevSGST => {
      const updatedSGST = [...prevSGST];
      updatedSGST[index] = sgstValue.toFixed(2);
      return updatedSGST;
    });

    const totalAmt = (parseFloat((price * quantities[index] - discounts[index]).toFixed(2)) + taxAmount).toFixed(2);
      setTotalAmts(prevTotalAmts => {
        const updatedTotalAmts = [...prevTotalAmts];
        updatedTotalAmts[index] = totalAmt;
        return updatedTotalAmts;
      });

    return taxAmount.toFixed(2);
  });
  setTaxes(updatedTaxes);

  // Calculate and set total tax
  const totalTax = updatedTaxes.reduce((acc, tax) => acc + parseFloat(tax), 0);
  setTotalTax(totalTax.toFixed(2));

  // Calculate and set total CGST
  const totalCGST = cgst.reduce((acc, tax) => acc + parseFloat(tax), 0);
  setTotalCGST(totalCGST.toFixed(2));

  // Calculate and set total SGST
  const totalSGST = sgst.reduce((acc, tax) => acc + parseFloat(tax), 0);
  setTotalSGST(totalSGST.toFixed(2));

  // Calculate and set grand total
  const grandTotal = totalAmts.reduce((acc, totalAmt) => acc + parseFloat(totalAmt), 0);
    setGrandTotal(grandTotal.toFixed(2));

}, [prices, quantities, discounts , cgst, sgst , totalAmts]);


const handlePriceBlur = (index, value) => {
  const newPrices = [...prices];
  newPrices[index] = parseFloat(value);
  setPrices(newPrices);
};

  const handleQuantityBlur = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = parseFloat(value);
    setQuantities(newQuantities);
  };

  // const handleDiscountBlur = (index, value) => {
  //   const newDiscounts = [...discounts];
  //   newDiscounts[index] = parseFloat(value);
  //   setDiscounts(newDiscounts);
  // };

  const handleDiscountBlur = (index, value) => {
    // If the value is null or undefined, set it to 0
    const discountValue = value === null || value === undefined ? 0 : parseFloat(value);
    const newDiscounts = [...discounts];
    newDiscounts[index] = discountValue;
    setDiscounts(newDiscounts);
  };

  const handleTaxBlur = (index, value) => {
    const newTaxes = [...taxes];
    newTaxes[index] = parseFloat(value);
    setTaxes(newTaxes);
  }

  const handleCGSTBlur = (index, value) => {
    const newCGST = [...cgst];
    newCGST[index] = parseFloat(value);
    setCGST(newCGST);
  }

  const handleSGSTBlur = (index, value) => {
    const newSGST = [...sgst];
    newSGST[index] = parseFloat(value);
    setSGST(newSGST);
  }

  const handleTotalAmtBlur = (index, value) => {
    const newTotalAmts = [...totalAmts];
    newTotalAmts[index] = parseFloat(value);
    setTotalAmts(newTotalAmts);
  }

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
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    }
    fetchAmount();
  }
  , []);

  useEffect(() => {
    if (grand_total > Minimum) {
      setDeductedPoint(location.state.deductedPoints || 0);
    } else {
      setDeductedPoint(0);
    }
  }, [grand_total, Minimum]);


  const bname = atob(localStorage.getItem('branch_name'));  

  const final_price = grand_total - deductedPoint;

  const handleGenerateInvoice = async (e) => {
    setLoading(true); 
    e.preventDefault();
  
    const newInvoice = services.map((service, index) => ({
      Description: service.value,
      Price: prices[index],
      Quantity: quantities[index],
      Discount: discounts[index],
      Tax_amt: taxes[index],
      CGST: cgst[index],
      SGST: sgst[index],
      Total_amount: totalAmts[index],
    }));
  
    setInvoice(newInvoice);
  
    const token = localStorage.getItem('token');
    console.log(token);
  
    const data = {
      customer_name: customer_name,
      mobile_no: mobile_no,
      email: email,
      services: JSON.stringify(newInvoice),
      address: address,
      service_by: service_by.map(service => service.value).toString(),
      total_prise: total_prise,
      total_quantity: total_quantity,
      total_discount: total_discount,
      total_tax: total_tax,
      grand_total: final_price,
      total_cgst: total_cgst,
      total_sgst: total_sgst,
      gst_number: gst_number,
      comment: comments,
      slno: invoiceId,
      json_data: producData,
      loyalty_points_deducted: deductedPoint
    };

  
    try {
      // Make the POST request
      const response = await axios.post(`${config.apiUrl}/api/swalook/billing/?branch_name=${bid}`, data, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      // Handle success

      if(response.status === 200){

      await handlePrint();
      
      setPopupMessage('Invoice generated successfully');
      setShowPopup(true);
      }
      // console.log('Invoice generated successfully:', response.data);
      // alert('Invoice generated successfully');
    } catch (error) {
      // Handle error
      setPopupMessage('Error generating invoice');
      setShowPopup(true);
      console.error('Error generating invoice:', error);
    }finally {
      setLoading(false); // Set loading to false when API call finishes
    }
  };
  

  

    // console.log('Invoice:' , invoice);
    // console.log('Invoice:json' , JSON.stringify(invoice));

  const [getInvoiceId , setInvoiceId] = useState(invoiceId);
  // useEffect(() => {
  //   axios.get(`${config.apiUrl}/api/swalook/get_specific_slno/`, {
  //     headers: {
  //       'Authorization': `Token ${localStorage.getItem('token')}`,
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //     .then(response => {
  //       console.log(response.data);
  //       setInvoiceId(response.data.slno);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching invoice id:', error);
  //     });
  // }
  // , []);

  const [getSaloonName, setSaloonName] = useState('');
  useEffect(()=>{
    setSaloonName(localStorage.getItem('saloon_name'));
  })

  const branchName = localStorage.getItem('branch_name');
  const sname = localStorage.getItem('s-name');


//   const handlePrint = () => {
//     const capture = document.querySelector('.invoice_main');
    
//     html2canvas(capture).then(canvas => {
//       const imgData = canvas.toDataURL('image/jpeg', 0.7);
      
//       // Create PDF with A4 size
//       const pdf = new jsPDF('l', 'mm', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();
      
//       // Define padding and margin
//       const padding = 10; // 10mm padding
//       const margin = 10;  // 10mm margin
      
//       // Calculate the available width and height for the image
//       const availableWidth = pdfWidth - 2 * margin;
//       const availableHeight = pdfHeight - 2 * margin;
      
//       // Calculate the image width and height to fit within the available area
//       const imgWidth = availableWidth - 2 * padding;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
//       // Position the image with padding and margin
//       const posX = margin + padding ;
//       const posY = margin + padding ;
      
//       // Add image to PDF
//       pdf.addImage(imgData, 'JPEG', posX, posY, imgWidth , imgHeight);
//       pdf.compress = true;
//       pdf.save(`Invoice-${getInvoiceId}.pdf`);  

//       // const pdfBlob = pdf.output('blob');
//       // const formData = new FormData();
//       // formData.append('file', pdfBlob, `Invoice-${getInvoiceId}.pdf`);

//       // const data = {
//       //   customer_name: customer_name,
//       //   mobile_no: mobile_no,
//       //   email: email,
//       //   vendor_branch_name: bname,
        // invoice_id: getInvoiceId,
        // file: pdfBlob
//       // }

//       // axios.post(`${config.apiUrl}/api/swalook/save-pdf`, formData, {
//       //   headers: {
//       //     'Authorization': `Token ${token}`,
//       //     'Content-Type': 'multipart/form-data'
//       //   }
//       // })
//       // .then(response => {
//       //   console.log('PDF saved successfully');
//       // })
//       // .catch(error => {
//       //   console.error('Error saving PDF', error);
//       // });

//     });
// };


const handlePrint = async () => {
  const capture = document.querySelector('.invoice_main');
  
  html2canvas(capture).then(async (canvas) => {
    const imgData = canvas.toDataURL('image/jpeg', 0.7);
    
    // Create PDF with A4 size
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Define padding and margin
    const padding = 10; // 10mm padding
    const margin = 10;  // 10mm margin
    
    // Calculate the available width and height for the image
    const availableWidth = pdfWidth - 2 * margin;
    const availableHeight = pdfHeight - 2 * margin;
    
    // Calculate the image width and height to fit within the available area
    const imgWidth = availableWidth - 2 * padding;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Position the image with padding and margin
    const posX = margin + padding;
    const posY = margin + padding;
    
    // Add image to PDF
    pdf.addImage(imgData, 'JPEG', posX, posY, imgWidth, imgHeight);
    pdf.compress = true;
    pdf.save(`Invoice-${getInvoiceId}.pdf`);
    const pdfBlob = pdf.output('blob');

    // Upload to Firebase Storage
    const pdfRef = ref(storage, `invoices/Invoice-${getInvoiceId}.pdf`);
    await uploadBytes(pdfRef, pdfBlob);

    // Get download URL
    const downloadURL = await getDownloadURL(pdfRef);
    
    // Create WhatsApp link
    const phoneNumber = `${mobile_no}`; // Replace with the customer's phone number
    const message = `Hi ${customer_name}!\nWe hope you had a pleasant experience at ${atob(branchName)}.\nWe are looking forward to servicing you again, attached is the invoice.\nThanks and Regards,\nTeam ${atob(branchName)}\n\nClick on the link to download:: ${downloadURL}`;
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp link
    window.open(whatsappLink, '_blank');

    const token = localStorage.getItem('token');

    // Create FormData and append the PDF file
    const formData = new FormData();
    formData.append('file', pdfBlob, `Invoice-${getInvoiceId}.pdf`);
    formData.append('customer_name', customer_name);
    formData.append('mobile_no', mobile_no);
    formData.append('email', email);
    formData.append('vendor_branch_name', bname);
    formData.append('invoice', getInvoiceId);

    // try {
    //   await axios.post(`${config.apiUrl}/api/swalook/save-pdf/`, formData, {
    //     headers: {
    //       'Authorization': `Token ${token}`,
    //       'Content-Type': 'multipart/form-data'
    //     }
    //   });
    //   console.log('PDF saved successfully.');
    // } catch (error) {
    //   console.error('Error saving PDF:', error);
    // }
  });
};



const handleSendInovice = async(formData) => {
 const token = localStorage.getItem('token');

  const data = {
    customer_name: customer_name,
    mobile_no: mobile_no,
    email: email,
    vendor_branch_name: bname,
    invoice: getInvoiceId,
    file: formData
  }

 await  axios.post(`${config.apiUrl}/api/swalook/save-pdf`, data, {
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('PDF saved successfully');
  })
  .catch(error => {
    console.error('Error saving PDF', error);
  });
}

  return (
    
    <div className='invoice_container'>
      <Helmet>
        <title>Invoice</title>
      </Helmet>
      
      <div  className='invoice_main'>
        <form onSubmit={handleGenerateInvoice}>
          <div>
        <div className='invoice_header'>
          {/* <img src={Logo1} alt='Logo' className='invoice_logo' /> */}
          <div className='invoice_name'>{getSaloonName}</div>
        </div>
        <div className='invoice_content'>
          <div className='invoice_left'>
            <h3><b>Invoice To:</b></h3>
            <p>{customer_name}</p>
            <p>{address}</p>
            <p>{email}</p>
            <p>{mobile_no}</p>
          </div>
          <div className='invoice_right'>
            <div className='invoice-invoice_id'>
            <p><b>Invoice Id:</b></p>
              <p>{getInvoiceId}</p>
            </div>
            <div className='invoice_date'>
              <p><b>Date of Invoice:</b> </p>
              <p>{getCurrentDate()}</p>
            </div>
            {isGST ? (
              <div className='invoice_gst'>
                <p><b>GST Number:</b> {gst_number}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className='table-responsive'>
          <table className='invoice_table table-bordered'>
            <thead>
              <tr style={{ border: '1px solid #787871', padding: '3px', backgroundColor: '#fff' }}>
                <th style={{ width: '5%' }}>S. No.</th>
                <th style={{ width: '30%' }}>DESCRIPTION</th>
                <th style={{ width: '10%' }}>PRICE</th>
                <th style={{ width: '10%' }}>QUANTITY</th>
                <th style={{ width: '10%' }}>DISCOUNT</th>
                {/* <th style={{ width: '10%' }}>CGST(2.5%)</th> */}
                {isGST ? (
                  <>
                    <th style={{ width: '10%' }}>TAX AMT(18%)</th>
                    <th style={{ width: '10%' }}>CGST(9%)</th>
                    <th style={{ width: '10%' }}>SGST(9%)</th>
                  </>
                ) : null}
                {/* <th style={{ width: '10%' }}>SGST(2.5%)</th> */}
                <th style={{ width: '10%', color: 'white', backgroundColor: '#0d6efd' }}>TOTAL AMT</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index} style={{ border: '1px solid #787871', padding: '3px', backgroundColor: '#fff' }}>
                  <td scope='col' style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td scope='col' className='text-center' style={{ textAlign: 'center' }}>{service.value}</td>
                  <td scope='col' className='text-center' style={{ textAlign: 'center' }}>
                    <input type='number' className='editable-field' id={`price_input_${index}`} value={prices[index]} readOnly onChange={(e) => handlePriceBlur(index, e.target.value)} />
                  </td>
                  
                  <td scope='col' className='text-center' style={{ textAlign: 'center' }}>
                    <input type='number' className='editable-field' id={`quantity_input_${index}`} value={quantities[index]} readOnly onBlur={(e) => handleQuantityBlur(index, e.target.value)} />
                  </td>
                  <td scope='col' className='text-center' style={{ textAlign: 'center' }}>
                    <input type='number' className='editable-field' id={`discount_input_${index}`} defaultValue={discounts[index] === null || discounts[index] === undefined ? 0 : discount}  onBlur={(e) => handleDiscountBlur(index, e.target.value)} />
                  </td>
                  {isGST ? (
                    <>
                     <td scope='col' className='text-center' style={{ textAlign: 'center' }} onChange={(e) => handleTaxBlur(index, e.target.value)}>{taxes[index]}</td>
                      <td scope='col' className='text-center' style={{ textAlign: 'center' }} onChange={(e) => handleCGSTBlur(index, e.target.value)}>{cgst[index]}</td>
                      <td scope='col' className='text-center' style={{ textAlign: 'center' }} onChange={(e) => handleSGSTBlur(index, e.target.value)}>{sgst[index]}</td>
                    </>
                  ) : null
                  }
                  {/* <td scope='col' className='text-center' style={{ textAlign: 'center' }} onChange={(e) => handleCGSTBlur(index, e.target.value)}>{cgst[index]}</td>
                  <td scope='col' className='text-center' style={{ textAlign: 'center' }} onChange={(e) => handleSGSTBlur(index, e.target.value)}>{sgst[index]}</td> */}
                  <td scope='col' style={{ width: '20%', color: 'black', textAlign: 'center' }} onChange={(e) => handleTotalAmtBlur(index , e.target.value)}>{totalAmts[index]}</td>
                </tr>
              ))}
              <tr style={{ border: '1px solid #787871', padding: '3px', backgroundColor: '#fff' }}>
                <th colSpan='2' style={{ width: '20%', color: 'white', fontWeight: 500, fontSize: 15, backgroundColor: '#0d6efd' }}>TOTAL</th>
                <th style={{ width: '5%', padding: '0.7%' }} className='text-center'>{total_prise}</th>
                <th style={{ width: '10%', padding: '0.7%' }} className='text-center'>{total_quantity}</th>
                <th style={{ width: '10%', padding: '0.7%' }} className='text-center'>{total_discount}</th>
                {/* <th style={{ width: '10%', padding: '0.7%' }} className='text-center'>{total_cgst}</th>
                <th style={{ width: '10%', padding: '0.7%' }} className='text-center'>{total_sgst}</th> */}
                {isGST ? (
                  <>
                    <th style={{ width: '10%', padding: '0.7%' }} className='text-center'>{total_tax}</th>
                    <th style={{ width: '10%', padding: '0.7%' }} className='text-center'>{total_cgst}</th>
                    <th style={{ width: '10%', padding: '0.7%' }} className='text-center'>{total_sgst}</th>
                  </>
                ) : null
                }
                {/* <th style={{ width: '10%', padding: '0.7%', backgroundColor: '#0d6efd', color: 'white' }}>{grand_total}</th> */}
                <th style={{ width: '10%', padding: '0.7%', backgroundColor: '#0d6efd', color: 'white' }}>
  {/* {deductedPoint > 0 ? ( */}
    <>
      <small style={{ color: 'white' }}>Loyality Points used: {deductedPoint}</small> <br />
      Total: {grand_total - deductedPoint} 
    </>
  {/* ) : (
    grand_total
  )} */}
</th>

              </tr>
            </tbody>
          </table>
        </div>
        {comments ? (
  <div className='inv_comm'>
    <h4>Comments:</h4>
    <p>{comments}</p>  
  </div>
) : null}

        <div className='invoice_footer'>
          <div className='invoice_footer_left'>
            <h4>Amount in Words:</h4>
            <p>{grandTotalInWords} Rupees Only</p>
          </div>
          <div className='invoice_footer_right'>
            <h4>FINAL VALUE:</h4>
            <p>Rs {grand_total - deductedPoint}</p>
          </div>
        </div>
        </div>
        
        </form>
      </div>
      <div className='generate-button-container'>
          <button className='generate-button' onClick={handleGenerateInvoice}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Final Invoice'}
          </button>
        </div>
      {showPopup && <Popup message={popupMessage} onClose={() => {setShowPopup(false); navigate(`/${sname}/${branchName}/dashboard`);} }/>}
    </div>
  );
}

export default Invoice;
