import React, { useState, useEffect } from 'react';
import { Footer, NavBar, SideBar } from '../components';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';

const ChoosePlan = () => {
    const { ojiiz_user } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState();
    const [selectedPlan, setSelectedPlan] = useState(100);
    const [amountPerOz, setAmountPerOz] = useState(0.6); 

    const API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/ojiiz/user-profile/${ojiiz_user.userName}`,
                    {
                        headers: {
                            'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                        },
                    });
                const data = await response.json();
                setUserData(data.user);
            } catch (error) {
                console.error('Error fetching user data:', error.message);
                toast.error('An error occurred while fetching user data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [ojiiz_user.userName, API_URL]);

    const handlePlanChange = (event) => {
        const value = parseInt(event.target.value);
        setSelectedPlan(value);
        updateAmountPerOz(value);
    };

    const handleRangeValueClick = (value) => {
        setSelectedPlan(value);
        updateAmountPerOz(value);
    };

    const updateAmountPerOz = (value) => {
        if (value < 500) {
            setAmountPerOz(0.6);
        } else if (value >= 500 && value < 1000) {
            setAmountPerOz(0.5);
        } else if (value >= 1000) {
            setAmountPerOz(0.45);
        }
    };

    const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

    const handleSubmit = async (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (selectedPlan < 100) {
            toast.error('You can buy a minimum of 100 oz credits.');
            return;
        }

        try {
            setLoading(true);
            const updatedUserData = { ...userData, selectedPlan };

            const stripe = await stripePromise;
            const response = await fetch(`${API_URL}/api/ojiiz/choose-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                },
                body: JSON.stringify(updatedUserData)
            });

            const session = await response.json();

            if (response.ok) {
                await stripe.redirectToCheckout({ sessionId: session.id }).then(function (result) {
                    if (result.error) {
                        console.error('An error occurred during checkout:', result.error.message);
                        toast.error(`Payment failed: ${result.error.message}`);
                    }
                }).catch(error => {
                    console.error('Error during checkout:', error.message);
                    toast.error(`Error during checkout: ${error.message}`);
                });
            } else {
                console.error('Failed to create checkout session:', session.error);
                toast.error(`Failed to create checkout session: ${session.error}`);
            }
        } catch (error) {
            console.error('Error signing up:', error.message);
            toast.error('Failed to sign up. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="jobDetail-navbar">
                <NavBar />
                <h1>Choose Plan</h1>
            </div>
            <ToastContainer />

            {loading && <div className="loader"></div>}
            <div className="your-plan">
                <SideBar />
                <div className="plan-content">
                    <h2>Customize oz</h2>
                    <div className="plan-range">
                        <b>Export oz</b>
                        <p>Export credits are shared across users. Select how many Export credits you would like for your team below.</p>
                        <div className="range-wrapper">
                            <input
                                type="range"
                                min="100"
                                max="2000"
                                value={selectedPlan}
                                onChange={handlePlanChange}
                                className="range-slider"
                            />
                            <div className="range-values">
                                {Array.from({ length: 8 }, (_, index) => 100 + 250 * index).concat(2000).map((value, index) => (
                                    <span
                                        key={index}
                                        className={`range-value ${value === selectedPlan ? 'active' : ''}`}
                                        onClick={() => handleRangeValueClick(value)}
                                    >
                                        {value}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="selected-plan">Selected Plan: {selectedPlan} oz</div>
                    </div>
                    <div className="plan-range">
                        <h2>Buy Credits</h2>
                        <div className="rate-list">
                            <ul>
                                <li onClick={() => handleRangeValueClick(100)}>Less than 500 oz: $0.6 per oz</li>
                                <li onClick={() => handleRangeValueClick(500)}>500 to 1000 oz: $0.5 per oz</li>
                                <li onClick={() => handleRangeValueClick(1000)}>Above 1000 oz: $0.45 per oz</li>
                            </ul>
                        </div>
                    </div>
                    <div className="your-plan-detail">
                        <b>Your available Connects</b>
                        <span>{userData && userData.totalCredit - userData.usedCredit}</span>
                        <b>Enter Your Amount of Credits</b>
                        <span>
                            <input
                                type="number"
                                min="100"
                                value={selectedPlan}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setSelectedPlan(value);
                                    updateAmountPerOz(value);
                                }}
                            />
                            <i>You can buy minimum 100 credits</i>
                        </span>
                        <br />
                        <b>Your account will be charged</b>
                        <span>{(selectedPlan * amountPerOz).toFixed(2)}$</span>
                        <b>Your new Connects balance</b>
                        <span>{userData && userData.totalCredit - userData.usedCredit + selectedPlan}</span>
                        <button onClick={handleSubmit}>Buy</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ChoosePlan;
