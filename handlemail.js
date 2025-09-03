const SibApiV3Sdk = require('@getbrevo/brevo');
require('dotenv').config();

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Set API key
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_EMAIL;

const handlemail = async (data) => {
  try {
    const { email, number, name, address, cart, orderNumber } = data;

    if (!cart || cart.length === 0) {
      throw new Error("Cart is empty or invalid.");
    }

    const imageUrls = {
      white: "http://cdn.mcauto-images-production.sendgrid.net/3fa0a841f17675d7/0d37cf67-f894-40b6-9e03-34a139bde74c/853x1280.png",
      tan: "http://cdn.mcauto-images-production.sendgrid.net/3fa0a841f17675d7/844c05c5-1405-4d1b-91c2-55e92d360a52/853x1280.png",
      black: "http://cdn.mcauto-images-production.sendgrid.net/3fa0a841f17675d7/516ba44a-fb71-4719-a9de-fda3366584cb/853x1280.png",
      grey: "http://cdn.mcauto-images-production.sendgrid.net/3fa0a841f17675d7/850fc5aa-2b9e-47b7-a420-6edea5dd340f/853x1280.png",
      blue: "http://cdn.mcauto-images-production.sendgrid.net/3fa0a841f17675d7/0ea1b17c-c272-4478-aa4f-9358885e2180/853x1280.png",
    };

    const cartItemsHTML = cart
      .map((item) => {
        const image = imageUrls[item.colour] || imageUrls["blue"];
        return `
          <div style="display: flex; align-items: center; padding: 1rem 0; border-bottom: 1px solid #ddd;">
            <img src="${image}" alt="${item.colour}" style="width: 100px; margin-right: 1rem;" />
            <div style="font-family: Arial, sans-serif;">
              <p><strong>Size:</strong> ${item.capacity}</p>
              <p><strong>Color:</strong> ${item.colour}</p>
              <p><strong>Quantity:</strong> ${item.quantity}</p>
              <p><strong>Price:</strong> R${item.price}</p>
            </div>
          </div>
        `;
      })
      .join("");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="text-align: center; color: #333;">VONGO</h1>
        <p>Hi ${name}, your order number is ${orderNumber}</p>
        <p>Thank you for shopping at VONGO! Your support means the world to us. Here's a summary of your order:</p>
        <div style="display:flex; flex-direction: column; align-items:center"> 
        <h2 style="margin-top: 2rem; color: #333;">Order Summary</h2>
        </div>
        ${cartItemsHTML}
        <h2 style="margin-top: 2rem; color: #333;">Shipping Information</h2>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Number:</strong> ${number}</p>
        <p style="margin-top: 2rem; text-align: center;">Thank you for your purchase! An email detailing the delivery times will follow shortly.</p>
      </div>
    `;

    // Construct Brevo email
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "Vongo Receipt";
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { email: "sales@vongo.co.za", name: "VONGO" };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.cc = [{ email: "info@vongo.co.za" }];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully", response);

    return response;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

module.exports = handlemail;