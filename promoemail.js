const SibApiV3Sdk = require('@getbrevo/brevo');
require('dotenv').config();

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Set API key from .env
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_EMAIL;

const sendEmail = async (email, promoCode) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
      <div style="background-color: #08405c; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Your Exclusive Offer!</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
        <h2 style="color: #333; font-size: 20px;">Get 20% Off Your First Purchase</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Thank you for joining us! Your unique promo code is:
        </p>
        <p style="font-size: 24px; font-weight: bold; color: #08405c; letter-spacing: 2px; background-color: #f0f0f0; padding: 10px; border-radius: 4px; display: inline-block;">
          ${promoCode}
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Use this code at checkout to enjoy <strong>20% off</strong> your first purchase.
        </p>
        <a href="https://vongo.co.za/Cart" style="display: inline-block; background-color: #08405c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 16px; margin-top: 20px;">
          Shop Now
        </a>
        <p style="color: #999; font-size: 14px; margin-top: 20px;">
          If you have any questions, contact us at <a href="mailto:info@vongo.co.za" style="color: #08405c;">info@vongo.co.za</a>.
        </p>
      </div>
      <div style="text-align: center; color: #999; font-size: 12px; padding: 10px;">
        &copy; ${new Date().getFullYear()} Vongo Flasks (pty) Ltd All rights reserved.
      </div>
    </div>
  `;

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = "Your 20% Off Promo Code!";
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = { email: "sales@vongo.co.za", name: "VONGO" };
  sendSmtpEmail.to = [{ email }];

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Promo email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error.response?.body || error.message);
    throw new Error("Failed to send promo code email.");
  }
};

module.exports = { sendEmail };