import React, { useState } from 'react';
import "./footer.css";

import axios from 'axios';
import instagram from "./photos/instagram.png"
import twitter from "./photos/twitter.png"






const Footer = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('Subscribe');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Subsribe');
        setError('');

        // Validate email format (basic validation)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);

        try {
            // Replace with your backend endpoint
            const response = await axios.post('/api/subscribe', { email });
            setMessage("Subscribed");
            setEmail(''); // Clear input field
        } catch (err) {
            setError('There was an error subscribing. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="footer-div">
            <div className="subscribe-form-header"><h3 className="subscribe-heading">SUBSCRIBE TO OUR NEWSLETTER</h3></div>
            
            <div className='subscribe-form-div'>
            
            <form onSubmit={handleSubmit}>
            <input
                    type="email"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='input-1'
                />
                <button className="subscribe-button"type="submit" disabled={loading}>{loading ? 'Subscribing...' : message }</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <div className='contact-info-div' >
                <h3>CONTACT US</h3>

                <ul className='contact-list'>
                    <li className='contact-list-item'>+27 71 613 8265</li>
                    <li className='contact-list-item'>info@vongo.co.za</li>
                </ul>
                

            </div>
            <div className='social-media-div'>
                <h3>FOLLOW US</h3>
                <div className='socials-icon-div'>
                        <a href="https://www.instagram.com/vongoflasks" 
                            
                            target="_blank" 
                            rel="noopener noreferrer"> 
                        <img className='social-icon' src={"https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"} />
                        </a>
                    <button className='social-button'>
                        <img className='social-icon' src={"https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg" } />
                    </button>
                </div>
            </div>
            
           
        </div>
    )
}

export default Footer;


