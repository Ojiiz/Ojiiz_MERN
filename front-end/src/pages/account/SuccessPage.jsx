import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const SuccessPage = () => {
    const { session_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/ojiiz/retrieve-session?session_id=${session_id}`,
                    {
                        headers: {
                            'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                        },
                    });
                if (response.ok) {
                    toast.success('Your oz add successfully');
                }
            } catch (err) {
                setError('Failed to retrieve session data');
            } finally {
                setLoading(false);
            }
        };

        fetchSessionData();
    }, [session_id, API_URL]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={styles.body}>
            <ToastContainer />
            <div className="card" style={styles.card}>
                <div style={styles.circle}>
                    <i className="checkmark">✓</i>
                </div>
                <h1 style={styles.title}>Success</h1>
                <p style={styles.paragraph}>Your transaction has been successfully completed.</p>
                <center>
                    <Link to={"/"}>
                        <button style={styles.button}>Proceed</button>
                    </Link>
                </center>
            </div>
        </div>
    );
};

const styles = {
    body: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '40px 0',
        background: '#EBF0F5',
        height: '100vh',
    },
    title: {
        color: '#88B04B',
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
        background: '#F8FAF5',
        margin: '0 auto',
    },
    card: {
        background: 'white',
        padding: '60px',
        borderRadius: '4px',
        boxShadow: '0 2px 3px #C8D0D8',
        display: 'inline-block',
        margin: '0 auto',
    },
    button: {
        marginTop: '20px',
        padding: '15px 50px',
        borderRadius: '20px',
        background: '#706BEB',
        color: 'white',
        fontSize: '16px',
    },
    details: {
        marginTop: '20px',
        textAlign: 'left',
    },
};

export default SuccessPage;
