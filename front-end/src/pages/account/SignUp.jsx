import React, { useState } from 'react';
import './account.css';
import { FaHome, FaEye, FaEyeSlash } from "react-icons/fa";
import img from '../../assets/profile-.png'
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    companyName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfPassword, setCnfShowPassword] = useState(false);

  const API_URL = process.env.REACT_APP_BASE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Reset errors
    setErrors({});

    // Check if any required field is empty
    const requiredFields = ['firstName', 'lastName', 'userName', 'email', 'password', 'confirmPassword'];
    const emptyFields = requiredFields.filter(field => !formData[field]);

    if (emptyFields.length > 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        ...emptyFields.reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {})
      }));
      toast.error('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(prevErrors => ({
        ...prevErrors,
        password: true,
        confirmPassword: true
      }));
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Check email syntax
    if (!isValidEmail(formData.email)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: true
      }));
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Check password strength
    if (!isStrongPassword(formData.password)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        password: true
      }));
      toast.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/ojiiz/check-unique`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
        },
        body: JSON.stringify({
          userName: formData.userName,
          email: formData.email
        })
      });

      const data = await response.json();

      if (!data.unique) {
        toast.error(data.message);
        setIsLoading(false);
        return;
      }
      toast.success('Ready to proceed next!');
      setTimeout(() => {
        navigate('/price', { state: { formData: formData } })
      }, 2000);
    } catch (error) {
      console.error('Error checking uniqueness:', error.message);
      toast.error('Failed to check uniqueness. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'firstName' || name === 'lastName') {
      const userName = generateUserName(formData.firstName, formData.lastName);

      setFormData(prevState => ({
        ...prevState,
        userName: userName
      }));

      // Fetch suggestions based on the generated username
      const suggestions = await checkUsername(userName);
      setSuggestions(suggestions);
    }
  };

  const generateUserName = (firstName, lastName) => {
    // Simple approach: concatenate first and last name
    const baseUserName = `${firstName}_${lastName}`.toLowerCase();
    return baseUserName;
  };

  const checkUsername = async (username) => {
    try {
      const response = await fetch(`${API_URL}/api/ojiiz/check-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
        },
        body: JSON.stringify({ username })
      });

      const data = await response.json();
      return data.suggestions;
    } catch (error) {
      console.error('Error checking username:', error.message);
      return [];
    }
  };

  // Utility function to check email syntax
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Utility function to check password strength
  const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='sign-in'>
      <ToastContainer />
      <div className="sign-content">
        <h1>Sign Up to your
          <br />
          <span>Success</span>
        </h1>
        <Link to={"/"}>
          <div className="home-icon">
            <FaHome size={34} color='white' />
          </div>
        </Link>
        <div className="sign-msg">
          <span>Quote</span>
          <h3>Love the simplicity of the service and the prompt customer support. We can’t imagine working without it.</h3>
          <img src={img} alt="" />
          <p>John Doe</p>
          <h4>CEO & Founder at Ojiiz</h4>
        </div>
      </div>

      <div className="sign-up-heading">
        <h2>SIGN UP</h2>
        {/* line */}
        <div className="line-container">
          <div className="dot-container">
            <div className="dot start"></div>
            <div className="dot-text">Sign Up</div>
          </div>
          <div className="line"></div>
          <div className="dot-container">
            <div className="dot mid"></div>
            <div className="dot-text"></div>
          </div>
          <div className="line"></div>
          <div className="dot-container">
            <div className="dot end"></div>
            <div className="dot-text"></div>
          </div>
        </div>
      </div>

      <div className="sign-up-fields">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <input className={`${errors.firstName ? 'error' : ''}`} type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder='First Name' />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder='Last Name' className={`${errors.lastName ? 'error' : ''}`} />
          </div>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder='User Name'
            className={errors.userName ? 'error' : ''}
          />

          {suggestions.length > 0 && (
            <div className="suggestions">
              <h3>Username taken. Try one of these:</h3>
              <span>
                {suggestions.map(suggestion => (
                  <p
                    key={suggestion}
                    type="button"
                    onClick={() => setFormData({ ...formData, userName: suggestion })}
                  >
                    {suggestion}
                  </p>
                ))}
              </span>
            </div>
          )}

          <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder='Email' className={errors.email ? 'error' : ''} />

          <div className="password-field">
            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder='Password' className={errors.password ? 'error' : ''} />
            {showPassword ? <FaEyeSlash className="toggle-password" onClick={togglePasswordVisibility} /> : <FaEye className="toggle-password" onClick={togglePasswordVisibility} />}
          </div>

          <div className="password-field">
            <input
              type={showCnfPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='Confirm Password'
              className={errors.confirmPassword ? 'error' : ''}
            />
            {showCnfPassword ? (
              <FaEyeSlash className="toggle-password" onClick={() => setCnfShowPassword(!showCnfPassword)} />
            ) : (
              <FaEye className="toggle-password" onClick={() => setCnfShowPassword(!showCnfPassword)} />
            )}
          </div>

          <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder='Phone Number (Optional)' min="0" />
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder='Company Name(Optional)' />
          <label htmlFor="term">
            <input type="checkbox" name="term" id="term" required />
            By registering you with our<span>Terms and Conditions</span>
          </label>
          <button type="submit">
            {isLoading ?
              <>
                <div className="loader-btn"></div>Processing
              </> :
              'Choose your plan'
            }
          </button>
          <div className="card-line"></div>
          <span>Already have account<Link to={"/sign-in"}> Sign In</Link></span>
        </form>
      </div>

      <div className="fade-in"></div>
    </div >
  );
};

export default SignUp;
