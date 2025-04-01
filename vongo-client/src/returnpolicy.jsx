import React from 'react';
import './returnpolicy.css';

const ReturnPolicy = () => {
  return (
    <div className="return-policy-container">
      <h1 className="policy-heading">Return Policy</h1>
      <p className="policy-intro">
        At Vongo Flasks, we want you to love your 1.9-liter insulated flask. If something isn’t right, we’re here to help! Since we’re an online-only store, all returns are handled through our courier partner, Courier Guy. Please read our policy below.
      </p>

      <h2 className="policy-subheading">Eligibility for Returns</h2>
      <ul className="policy-list">
        <li>Returns are accepted within <strong>30 days</strong> of delivery.</li>
        <li>The flask must be unused, in its original packaging, and in the same condition as when you received it.</li>
        <li>Proof of purchase (order number or receipt) is required.</li>
        <li>We do not accept returns for items damaged due to misuse or improper care.</li>
      </ul>

      <h2 className="policy-subheading">How to Return Your Flask</h2>
      <ol className="policy-steps">
        <li>
          <strong>Contact Us</strong>: Email us at <a href="mailto:support@vongo.co.za" className="policy-link">support@vongo.co.za</a> with your order number and reason for return within 30 days of delivery.
        </li>
        <li>
          <strong>Get Approval</strong>: We’ll review your request and send you a return authorization (RA) number if approved.
        </li>
        <li>
          <strong>Package It Up</strong>: Securely pack the flask in its original box, including all accessories and the RA number written on the outside.
        </li>
        <li>
          <strong>Ship It Back</strong>: We’ll arrange a pickup with Courier Guy. You’ll receive a return shipping label—do not ship it yourself unless instructed otherwise.
        </li>
      </ol>

      <h2 className="policy-subheading">Refunds</h2>
      <p className="policy-text">
        Once we receive and inspect your returned flask, we’ll notify you via email about approval. If approved:
      </p>
      <ul className="policy-list">
        <li>Refunds will be processed to your original payment method within <strong>7-10 business days</strong>.</li>
        <li>Original shipping costs are non-refundable.</li>
        <li>If the flask was damaged in transit to you, let us know immediately for a replacement or refund.</li>
      </ul>

      <h2 className="policy-subheading">Questions?</h2>
      <p className="policy-text">
        Since we don’t have a physical store, feel free to reach out online! Contact us at <a href="mailto:support@vongo.co.za" className="policy-link">support@vongo.co.za</a>
      </p>
    </div>
  );
};

export default ReturnPolicy;