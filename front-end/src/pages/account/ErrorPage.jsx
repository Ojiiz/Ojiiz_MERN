import React from 'react';
import { MdOutlineClose } from "react-icons/md";
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div style={styles.body}>
            <div style={styles.card}>
                <div style={styles.circle}>
                    <span className="error-icon"><MdOutlineClose /></span>
                </div>
                <h1 style={styles.title}>Failed</h1>
                <p style={styles.paragraph}>We encountered an error processing your request. <br /> Please try again later.</p>
                <center>
                    <Link to={"/"}>
                        <button style={styles.button}>Procced</button>
                    </Link>
                </center>
            </div>
        </div>
    );
};

const styles = {
    body: {
        textAlign: 'center',
        padding: '40px 0',
        background: 'rgb(244, 213, 213)',
        height: '100vh'
    },
    title: {
        color: 'rgb(250, 68, 68)',
        fontFamily: 'Nunito Sans, Helvetica Neue, sans-serif',
        fontWeight: 900,
        fontSize: '40px',
        marginBottom: '10px',
    },
    paragraph: {
        color: '#404F5E',
        fontFamily: 'Nunito Sans, Helvetica Neue, sans-serif',
        fontSize: '20px',
        margin: 0,
    },
    circle: {
        borderRadius: '200px',
        height: '200px',
        width: '200px',
        background: 'rgb(244, 213, 213)',
        margin: '0 auto',
    },
    card: {
        background: 'white',
        padding: '60px',
        borderRadius: '4px',
        boxShadow: '0 2px 3px #C8D0D8',
        display: 'inline-block',
        margin: '0 auto',
        textAlign: 'center',
    },
    icon: {
        color: '#9ABC66',
        fontSize: '100px',
        lineHeight: '200px',
        marginLeft: '-15px',
    },
    button: {
        marginTop: '20px',
        padding: '15px 50px',
        borderRadius: '20px',
        background: '#706BEB',
        color: 'white',
        fontSize: '16px'
    }
};

export default ErrorPage;
