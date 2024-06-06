import React, { useState } from 'react';
import visa from '../../assets/icons/visa.png'
import chip from '../../assets/icons/chip.png'
import { FaLock } from "react-icons/fa";

const CheckOut = () => {

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    return (
        <div className='choose-plans'>
            <div className="sign-up-heading">
                <h2>SIGN UP</h2>
                {/* line */}
                <div className="line-container">
                    <div className="dot-container">
                        <div className="dot start"></div>
                        <div className="dot-text"></div>
                    </div>
                    <div className="line"></div>
                    <div className="dot-container">
                        <div className="dot mid"></div>
                        <div className="dot-text"></div>
                    </div>
                    <div className="line"></div>
                    <div className="dot-container">
                        <div className="dot end"></div>
                        <div className="dot-text">Check Out</div>
                    </div>
                </div>
            </div>
            <div className="checkout-page">
                <div className="checkout-detail">
                    <div className="checkout-detail-card">
                        <p>You’re paying,</p>
                        <h3>$499.00</h3>
                        <div className="package-detail">
                            <div className='row'>
                                <b>Advanced</b>
                                <p>$ 499</p>
                            </div>
                            <span>250 jobs + emails + phone number +
                                LinkedIn + 2 seats</span>
                            <div className="row">
                                <b>Discounts & Offers</b>
                                <p>$ 0.00</p>
                            </div>
                        </div>
                        <div className="card-line"></div>
                        <div className='row'>
                            <b>Tax</b>
                            <p>$ 0.00</p>
                        </div>
                        <div className='row'>
                            <b>Total</b>
                            <p>$ 499</p>
                        </div>
                    </div>
                </div>

                <div className="payment-detail">
                    <h2>Payment Details</h2>
                    <div className="credit-card">
                        <img src={visa} alt="" style={{ float: 'right' }} />
                        <br />
                        <br />
                        <img src={chip} alt="" />
                        {/* <RiVisaLine size={100} color='#213157'/> */}
                        <div className="card-number">{cardNumber ? cardNumber : '0000 0000 0000 0000'}</div>
                        <div className="row">
                            <div className="card-name"><span>Owner Name</span>{cardName ? cardName : 'Fenix'}</div>
                            <div className="expiry-date"><span>Expiry</span>{expiryDate ? expiryDate : 'MM/DD'}</div>
                            <div className="cvv"><span>CVV</span>{cvv ? cvv : '000'}</div>
                        </div>
                    </div>
                    <form className="credit-card-form">
                        <label htmlFor="card-number">
                            Card Holder Name
                            <input type="text" id="card-number" name="card-number" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder='Fenix' />
                        </label>
                        <label htmlFor="card-name">
                            Card Number
                            <input type="number" id="card-name" name="card-name" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder='0000 0000 0000 0000' />
                        </label>
                        <div className="row">
                            <label htmlFor="expiry-date">
                                Expiry Date
                                <input type="text" id="expiry-date" name="expiry-date" placeholder="MM/YY" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                            </label>
                            <label htmlFor="cvv">
                                CVV
                                <input type="number" id="cvv" name="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder='000' />
                            </label>
                        </div>
                        <div className="payment-text">
                            <h3>Payment</h3>
                            <span><p>Payments are SSL encrypted so that your credit card and payment details stay safe.</p>
                                <FaLock />
                            </span>
                        </div>
                        <div className="checkout-btn">
                            <p>Total: $450.00</p>
                            <button type="submit">PURCHASE</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CheckOut;
