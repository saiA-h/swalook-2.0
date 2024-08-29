import React, { useState , useEffect} from 'react';
import axios from 'axios';
import '../Styles/BusinessAnalysis.css';
import Header from './Header';
import { Helmet } from 'react-helmet';
import VertNav from './VertNav';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import ScoreOutlinedIcon from '@mui/icons-material/ScoreOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import config from '../../config';

// import {
//     Line
// } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     LineElement,
//     PointElement,
//     CategoryScale,
//     LinearScale,
//     Title,
//     Tooltip,
//     Legend
// } from 'chart.js';

// // Register the necessary components for Chart.js
// ChartJS.register(
//     LineElement,
//     PointElement, // Ensure PointElement is registered
//     CategoryScale,
//     LinearScale,
//     Title,
//     Tooltip,
//     Legend
// );

import {
    Bar
} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

const generateRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        colors.push(`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`);
    }
    return colors;
};

function BusinessAnalysis() {
    const branchName = localStorage.getItem('branch_name');
    const sname = localStorage.getItem('s-name');
    const userType = localStorage.getItem('type');
    const [selectedCard, setSelectedCard] = useState('');
    const [analysisUrl, setAnalysisUrl] = useState('');
    

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     const fetchAnalysisData = async () => {
    //         try {
    //             const response = await axios.get('https://api.crm.swalook.in/api/swalook/analysis/month/business/_01/', {
    //                 headers: {
    //                     Authorization: `Token ${token}`
    //                 }
    //             });
    //             if (response.status === 200) {
    //                 setAnalysisUrl(response.data.url);
    //             }
    //         } catch (error) {
    //             console.error("There was an error fetching the analysis data!", error);
    //         }
    //     };

    //     fetchAnalysisData();
    // }, []);

    const [chartData, setChartData] = useState(null); // Ensure this is defined

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     const fetchAnalysisData = async () => {
    //         try {
    //             const response = await axios.get('https://api.crm.swalook.in/api/swalook/analysis/month/business/_01/', {
    //                 headers: {
    //                     Authorization: `Token ${token}`
    //                 }
    //             });
    //             if (response.status === 200) {
    //                 const { dates, values } = response.data;
    //                 setChartData({
    //                     labels: dates,
    //                     datasets: [
    //                         {
    //                             label: 'Business Analysis',
    //                             data: values,
    //                             borderColor: '#091A44',
    //                             backgroundColor: 'rgba(9, 26, 68, 0.2)',
    //                             borderWidth: 2,
    //                             fill: true
    //                         }
    //                     ]
    //                 });
    //             }
    //         } catch (error) {
    //             console.error("There was an error fetching the analysis data!", error);
    //         }
    //     };

    //     fetchAnalysisData();
    // }, []);

    const bid = localStorage.getItem('branch_id');
    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchAnalysisData = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/api/swalook/analysis/month/business/_01/?branch_name=${bid}`, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                if (response.status === 200) {
                    const { dates, values } = response.data;

                    // Generate an array of colors for each bar
                    const colors = generateRandomColors(values.length);

                    setChartData({
                        labels: dates,
                        datasets: [
                            {
                                label: 'Business Analysis',
                                data: values,
                                backgroundColor: colors, // Different color for each bar
                                borderColor: colors.map(color => color.replace('0.7', '1')), // Use a more opaque color for the borders
                                borderWidth: 1
                            }
                        ]
                    });
                }
            } catch (error) {
                console.error("There was an error fetching the analysis data!", error);
            }
        };

        fetchAnalysisData();
    }, []);
    

    const handleCardClick = (text) => {
        setSelectedCard(text);
    };

    const isSelected = (text) => text === selectedCard ? 'ba_card selected' : 'ba_card';

    return (
        <div className='business_main'>
            <Header />
            <Helmet>
                <title>Business Analysis</title>
            </Helmet>
            <div className='ba_horizontal'>
                <div className='ba_h1'>
                    <div className='ba_ver_nav'>
                        <VertNav />
                    </div>
                </div>
                <div className='ba_h2'>
                    <h1 className='ba_heading'>Business Analysis</h1>
                    <div className='ba_cards'>
                        <div className={isSelected('Monthly Analysis')} onClick={() => handleCardClick('Monthly Analysis')}>
                            <BarChartOutlinedIcon className='ba_card_img' sx={{color:"white", fontSize: "48px"}} />
                            <p className='ba_card_text'>Monthly Analysis</p>
                        </div>
                        {/* <div className={isSelected('Stock Analysis')} onClick={() => handleCardClick('Stock Analysis')}>
                            <ScoreOutlinedIcon className='ba_card_img' sx={{color:"white", fontSize: "48px"}} />
                            <p className='ba_card_text'>Stock<br /> Analysis</p>
                        </div>
                        <div className={isSelected('Invoice Data')} onClick={() => handleCardClick('Invoice Data')}>
                            <ReceiptOutlinedIcon className='ba_card_img' sx={{color:"white", fontSize: "48px"}} />
                            <p className='ba_card_text'>Invoice<br /> Data</p>
                        </div>
                        <div className={isSelected('Data Analysis')} onClick={() => handleCardClick('Data Analysis')}>
                            <QueryStatsOutlinedIcon className='ba_card_img' sx={{color:"white", fontSize: "48px"}} />
                            <p className='ba_card_text'>Data <br />Analysis</p>
                        </div> */}
                    </div>
                    <hr className='ba_horizontal_line' />

                    <div className='ba_select_analysis'>
                        <div className='ba-1'>
                            <ShowChartIcon className='ba_month_icon' sx={{color:"#091A44"}} />
                            <h2 className='ba_select_heading'>{selectedCard || 'Monthly Analysis'}</h2>
                        </div>
                        <div className='ba-2'>
                            <select className='ba_select_month'>
                                <option value="">Select Month</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                            <CalendarMonthIcon className='ba_month_icon' sx={{color:"#091A44"}} />
                        </div>
                    </div>
                    <div className='ba_content'>
                        {/* Add your content here */}
                        {chartData ? (
                            <Bar
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Monthly Analysis Chart',
                                        },
                                    },
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Date',
                                            },
                                        },
                                        y: {
                                            title: {
                                                display: true,
                                                text: 'Amount',
                                            },
                                        },
                                    },
                            
                                    animation: {
                                        duration: 1000, // Duration of the animation in milliseconds
                                        easing: 'easeInOutQuad', // Easing function for the animation
                                    }
                                }}
                                className='ba_analysis_img'
                                style={{ width: '80%', height: 'auto', margin: 'auto' }}
                            />
                        ) : (
                            <p className='ba_p'>No data to display</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BusinessAnalysis;
