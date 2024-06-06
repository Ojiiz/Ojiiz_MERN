import React, { useEffect, useState } from 'react';
import { AdminSideBar, AdminTopBar } from '../components';
import { FaUser } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import { LiaBandcamp } from "react-icons/lia";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import moment from 'moment';

const AdminHome = () => {
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalClients, setTotalClients] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('day');

    const API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const totalJobsResponse = await fetch(`${API_URL}/api/ojiiz/all-job`);
                if (totalJobsResponse.ok) {
                    const jobsData = await totalJobsResponse.json();
                    setTotalJobs(jobsData.length);
                } else {
                    console.error('Failed to fetch total jobs:', totalJobsResponse.statusText);
                }

                const clientsResponse = await fetch(`${API_URL}/api/ojiiz/client`);
                if (clientsResponse.ok) {
                    const clientsData = await clientsResponse.json();
                    setTotalClients(clientsData.length);
                    processDataForChart(clientsData, timeRange);
                } else {
                    console.error('Failed to fetch clients:', clientsResponse.statusText);
                }

                const usersResponse = await fetch(`${API_URL}/api/ojiiz/admin-user`);
                if (usersResponse.ok) {
                    const usersData = await usersResponse.json();
                    setTotalUsers(usersData.length);
                } else {
                    console.error('Failed to fetch users:', usersResponse.statusText);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    const processDataForChart = (clientsData, range) => {
        const format = range === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD';
        const dateCountMap = clientsData.reduce((acc, client) => {
            const date = moment(client.createdAt).startOf(range).format(format);
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date]++;
            return acc;
        }, {});

        const chartData = Object.keys(dateCountMap).map(date => ({
            date,
            'Total Clients': dateCountMap[date],
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        setChartData(chartData);
    };

    return (
        <div className='admin-page'>
            <AdminSideBar />
            <ToastContainer />
            <div className="admin-detail">
                <AdminTopBar />
                {isLoading && <div className="loader"></div>}
                <div className="admin-content">
                    <div className="admin-box-row">
                        <div className="admin-box">
                            <span>
                                <h3>Total Clients</h3>
                                <p>{totalClients}</p>
                            </span>
                            <HiMiniUserGroup size={50} color='white' />
                        </div>
                        <div className="admin-box" style={{ backgroundColor: '#D4E6F1' }}>
                            <span>
                                <h3>Total Jobs</h3>
                                <p>{totalJobs}</p>
                            </span>
                            <LiaBandcamp size={50} color='white' />
                        </div>
                        <div className="admin-box" style={{ backgroundColor: 'var(--primary-color)' }}>
                            <span>
                                <h3>Total Admin's</h3>
                                <p>{totalUsers}</p>
                            </span>
                            <FaUser size={50} color='white' />
                        </div>
                    </div>
                    <div className="admin-line-chart">
                        <div className="chart-controls">
                            <label>
                                <input
                                    type="radio"
                                    value="day"
                                    checked={timeRange === 'day'}
                                    onChange={handleTimeRangeChange}
                                />
                                <span>Day</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="week"
                                    checked={timeRange === 'week'}
                                    onChange={handleTimeRangeChange}
                                />
                                <span>Week</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="month"
                                    checked={timeRange === 'month'}
                                    onChange={handleTimeRangeChange}
                                />
                                <span>Month</span>
                            </label>
                        </div>
                        <ResponsiveContainer width="95%" height="100%">
                            <LineChart
                                width={500}
                                height={300}
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => moment(date).format(timeRange === 'month' ? 'MMM YYYY' : 'D MMM, YYYY')}
                                />
                                <YAxis tickFormatter={(value) => value} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Total Clients" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
