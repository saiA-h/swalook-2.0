import React, { useState, useEffect } from 'react';
import '../Styles/Inventory.css'
import Header from './Header';
import { Helmet } from 'react-helmet';
import AddProductPopup from './AddProductPopup';
import DeleteProductPopup from './DeleteProductPopup';
import EditProductPopup from './EditProductPopup';
import config from '../../config';
import EditIcon from '@mui/icons-material/Edit';

function Inventory() {
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [editProductData, setEditProductData] = useState(null);
    const [inventoryData, setInventoryData] = useState([]);

    const AddtogglePopup = () => {
        setIsAddPopupOpen(!isAddPopupOpen);
    };

    const DeletetogglePopup = () => {
        setIsDeletePopupOpen(!isDeletePopupOpen);
    };

    const EdittogglePopup = (product) => {
        setEditProductData(product);
        setIsEditPopupOpen(!isEditPopupOpen);
    };

    const [editServiceData, setEditServiceData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const branchName = localStorage.getItem('branch_name');
                const token = localStorage.getItem('token');

                if (!branchName || !token) {
                    throw new Error('Branch name or token is missing.');
                }

                const response = await fetch(`${config.apiUrl}/api/swalook/inventory/product/view/?branch_name=${atob(branchName)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }

                const data = await response.json();
                setInventoryData(data.data);
            } catch (error) {
                console.error('Error fetching inventory data:', error);
            }
        };

        fetchData();
    }, []);


  return (
    <div className='admin_inventory_container'>
            <Helmet>
        <title>Inventory</title>
      </Helmet>
            <div className='c_header'>

            <Header />
            </div>
            <div className="inventory_details_header">
                <h1>Inventory Details</h1>
                <div>
                    <button className="add_inventory_button" onClick={AddtogglePopup}>Add </button>
                    <button className="delete_inventory_button" onClick={DeletetogglePopup}>Delete </button>
                </div>
            </div>
            <div className="horizontal_line_container">
                <hr className="horizontal_line" />
            </div>
            <div className="admin_inventory_table_container">
                <table className="admin_inventory_table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th> Name</th>
                            <th>SKU</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                    {inventoryData.map((item, index) => (
                            <tr key={item.product_id}>
                                <td>{index + 1}</td>
                                <td>{item.product_name}</td>
                                <td>{item.product_id}</td>
                                <td>{item.stocks_in_hand}</td>
                                <td>{item.product_price}</td>
                                <td> <EditIcon
                                        onClick={() => EdittogglePopup(item)}
                                        style={{ cursor: 'pointer' }}
                                    /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isAddPopupOpen && <AddProductPopup onClose={AddtogglePopup} />}
            {isDeletePopupOpen && <DeleteProductPopup onClose={DeletetogglePopup} />}
            {isEditPopupOpen && <EditProductPopup productData={editProductData} onClose={EdittogglePopup} />}
        </div>
  )
}

export default Inventory