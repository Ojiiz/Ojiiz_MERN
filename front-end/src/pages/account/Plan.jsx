import React, { useState } from 'react';
import { FaArrowRight } from "react-icons/fa6";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';

const Plan = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const formData = location.state?.formData || {};

    const [planType, setPlanType] = useState('');
    const [planPrice, setPlanPrice] = useState(0);
    const [planCredit, setPlanCredit] = useState(0);

    const [isLoading, setIsLoading] = useState(false);


    const API_URL = process.env.REACT_APP_BASE_API_URL;
    const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!planType) {
            toast.error('Please Select the Plan');
            return;
        }

        // Check if all required fields are filled
        const requiredFields = ['firstName', 'lastName', 'userName', 'email', 'password', 'confirmPassword', 'companyName'];
        const emptyFields = requiredFields.filter(field => !formData[field]);

        if (emptyFields.length > 0) {
            toast.error('Something went wrong, Please Enter Field again');
            setTimeout(() => {
                navigate('/sign-up');
            }, 2000);
            return;
        }

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }


        try {
            setIsLoading(true);

            // First, create the user
            const createUserResponse = await fetch(`${API_URL}/api/ojiiz/user-signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const createUserData = await createUserResponse.json();

            if (!createUserResponse.ok) {
                console.error('Failed to sign up:', createUserData.error);
                toast.error(`Failed to sign up: ${createUserData.error}`);
                return;
            }

            toast.success('User signed up successfully');

            // Redirect to sign-in page if the plan is free
            if (planType === 'free') {
                setTimeout(() => {
                    navigate('/sign-in');
                }, 2000);
                return;
            }

            // Add planType to formData
            formData.planType = planType;
            formData.planPrice = planPrice;
            formData.planCredit = planCredit;
            
            // For non-free plans, proceed with checkout session
            const stripe = await stripePromise;

            const response = await fetch(`${API_URL}/api/ojiiz/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
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
            setIsLoading(false);
        }
    };



    return (
        <div className='choose-plans'>
            <ToastContainer />
            <div className="sign-up-heading">
                <h2>SIGN UP</h2>
                <div className="line-container">
                    <div className="dot-container">
                        <div className="dot start"></div>
                        <div className="dot-text"></div>
                    </div>
                    <div className="line"></div>
                    <div className="dot-container">
                        <div className="dot mid"></div>
                        <div className="dot-text">Select your plan</div>
                    </div>
                    <div className="line"></div>
                    <div className="dot-container">
                        <div className="dot end"></div>
                        <div className="dot-text"></div>
                    </div>
                </div>
            </div>
            <div className="plans-page">
                <div className="plans-row">

                    {/* free plan */}
                    <div className={`plan ${planType === 'free' ? 'ulti' : ''}`}>
                        <div className="plan-header">
                            <h2>Freemium</h2>
                        </div>
                        <div className="plan-line"></div>
                        <div className="plan-price">
                            <p><span>Free</span></p>
                            <button>$0.60 (USD) per oz credit</button>
                        </div>
                        <div className="plan-line"></div>
                        <div className="plan-detail">
                            <p>No credit card required</p>
                            <p>Pay as you go</p>
                            <p>Get unlimited access</p>
                        </div>
                        <button className='plan-btn' onClick={() => { setPlanType('free'); setPlanPrice(0); setPlanCredit(0) }}>Get Started</button>
                    </div>

                    {/* advance plan */}
                    <div className={`plan ${planType === 'advanced' ? 'ulti' : ''}`}>
                        <div className="plan-header">
                            <h2>Advanced</h2>
                            <div className="offer">Popular</div>
                        </div>
                        <div className="plan-line"></div>
                        <div className="plan-price">
                            <p><span>$499</span>/(one Time Payment)</p>
                            <button>$0.49 (USD) per oz credit</button>
                        </div>
                        <div className="plan-line"></div>
                        <div className="plan-detail">
                            <p>999 oz</p>
                            <p>All in freemium</p>
                            <p>Discounted rates</p>
                            <p>Early features access</p>
                        </div>
                        <button className='plan-btn' onClick={() => { setPlanType('advanced'); setPlanPrice(499); setPlanCredit(999) }}>Get Started</button>
                    </div>

                    {/* ulti plan */}
                    <div className={`plan ${planType === 'ultimate' ? 'ulti' : ''}`}>
                        <div className="plan-header">
                            <h2>Ultimate</h2>
                        </div>
                        <div className="plan-line"></div>
                        <div className="plan-price">
                            <p><span>$999</span>/(one Time Payment)</p>
                            <button>$0.45 (USD) per oz credit</button>
                        </div>
                        <div className="plan-line"></div>
                        <div className="plan-detail">
                            <p>2200 oz </p>
                            <p>All in advanced</p>
                            <p>24/7 urgent support</p>
                            <p>Get 1 insights blog</p>
                            <p>Access to accounts manager</p>
                        </div>

                        <button className='plan-btn' onClick={() => { setPlanType('ultimate'); setPlanPrice(999); setPlanCredit(2200) }}>Get Started</button>
                    </div>
                </div>

                <div className="proceed-btn">
                    <button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ?
                            <>
                                <div className="loader-btn"></div>Processing
                            </> :
                            <>
                                Proceed to Checkout <FaArrowRight />
                            </>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Plan;
