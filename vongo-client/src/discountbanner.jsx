import React, { useState } from 'react';
import axios from "axios";
import './discountbanner.css';



const Banner = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const showPopup = () => setIsPopupOpen(true);
    const closePopup = () => {
        setIsPopupOpen(false);
        setEmail('');
        setError('');
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const submitEmail = async () => {
        const cleanemail = email.trim();
        setError('');
        setIsLoading(true);
    
        try {
            console.log(email);
            const response = await axios.post("/api/getdiscountcode", {
                email: cleanemail
            });
    
            alert(response.data.message || 'Thank you! Check your email for your unique promo code.');
            closePopup();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
    
            // Check if the error is because the email was already used
            if (err.response?.status === 400 && err.response?.data?.existingPromoCode) {
                alert(`This email has already been used to generate a promo code. Your promo code is: ${err.response.data.existingPromoCode}`);
            } else {
                // For other errors, display the generic error message
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    
    return (
        <>
            <div className="banner" onClick={showPopup}>
                Click here to get 20% off your first purchase!
            </div>
            {isPopupOpen && (
                <>
                    <div className="overlay" onClick={closePopup}></div>
                    <div className="popup">
                        <span className="close-popup" onClick={closePopup}>×</span>
                        <div className="popup-content">
                            <h2>Get 20% Off!</h2>
                            <p>The rumours are true! Get 20% off your first Vongo - on us. Enter your email and we'll send you a unique code to enter on checkout</p>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button onClick={submitEmail}>Get My Code</button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Banner;