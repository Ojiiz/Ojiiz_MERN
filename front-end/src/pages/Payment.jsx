import React from 'react'
import { NavBar, SideBar } from '../components'
import card from '../assets/icons/credit.png'

const Payment = () => {
    return (
        <div>
            <div className="jobDetail-navbar">
                <NavBar />
                <h1>Overview</h1>
            </div>
            <div className="payment-page">
                <SideBar />
                <div className="payment-content">
                    <h2>Billing & payments</h2>
                    <div className="billing-box">
                        <h3>Balance</h3>
                        <p>Your balance is <b>$10.00</b></p>
                        <button>Pay Now</button>
                    </div>
                    <div className="billing-box">
                        <div className="billing-header">
                            <span>
                                <h3>Manage billing methods</h3>
                                <p>Add, update, or remove your billing methods</p>
                            </span>
                            <button>Add a New Billing Method</button>
                        </div>
                        <div className="billing-body">
                            <h4>Primary</h4>
                            <p>Your primary billing method is used all recurring payments</p>
                            <div className="card-line" style={{ backgroundColor: "#C4C4C4", marginTop: "10px" }}></div>
                            <div className="billing-credit-card">
                                <div className="credit-card-text">
                                    <div className="icon">
                                        <img src={card} alt="" />
                                    </div>
                                    <div className="">
                                        <p>Card Number Ending in</p>
                                        <span>**** **** 5600</span>
                                    </div>
                                </div>
                                <div className="credit-card-btn">
                                    <p>Edit</p>
                                    <div className="vertical-line"></div>
                                    <p>Remove</p>
                                </div>

                            </div>
                            <div className="card-line" style={{ backgroundColor: "#C4C4C4", marginTop: "10px" }}></div>
                            <h4>Additional</h4>
                            <div className="card-line" style={{ backgroundColor: "#C4C4C4", marginTop: "10px" }}></div>
                            <div className="billing-credit-card">
                                <div className="credit-card-text">
                                    <div className="icon">
                                        <img src={card} alt="" />
                                    </div>
                                    <div className="">
                                        <p>Card Number Ending in</p>
                                        <span>**** **** 5600</span>
                                    </div>
                                </div>
                                <div className="credit-card-btn">
                                    <p>Edit</p>
                                    <div className="vertical-line"></div>
                                    <p>Set As Primary</p>
                                    <div className="vertical-line"></div>
                                    <p>Remove</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Payment
