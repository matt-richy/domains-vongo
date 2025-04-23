import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './reviews.css';

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [hover, setHover] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("/api/getreviews");
        console.log(response, "got reviews")
        setReviews(response.data);
        setLoading(false);
      } catch (err) {
        setFetchError('Failed to load reviews. Please try again later.');
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post("/api/reviews", {
        rating,
        comment,
        name,
      });

     
        console.log("successfully saved")
        setSuccess('Review submitted successfully!');
        setIsSubmitted(true);
        // Reset form
        setRating(0);
        setComment('');
        setName('');

        const updatedReviews = await axios.get("/api/getreviews");
        setReviews(updatedReviews.data);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
          ★
        </span>
      ));
  };

  return (
    <>
    <div className="review-container">
      <div className="review-form">
        <h2>Submit Your Review</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div>
          <div className="form-group">
            <label>Rating</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(rating)}
                  className={`star ${hover >= star || rating >= star ? 'filled' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="comment-input"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="name-input"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="submit-button"
            disabled={rating === 0 || !comment || !name || isSubmitted}
          >
            {isSubmitted ? 'Submitted' : 'Submit Review'}
          </button>
        </div>
      </div>

     
    </div>
    
    <div className="reviews-list">
  <h3>Customer Reviews</h3>
  {loading && <p className="loading-message">Loading reviews...</p>}

  {!loading && reviews.length === 0 && <p>No reviews yet. Be the first to share!</p>}
  {!loading && reviews.length > 0 && (
    <div className="review-grid">
      {reviews.map((review) => (
        <div key={review._id} className="review-item">
          <div className="review-header">
            <span className="review-name">{review.name}</span>
            <span className="review-date">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="review-stars">{renderStars(review.rating)}</div>
          <p className="review-comment">{review.comment}</p>
        </div>
      ))}
    </div>
  )}
</div>
    </>
  );
};

export default ReviewForm;