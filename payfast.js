const qs = require('querystring');
const crypto = require('crypto');


const generateAPISignature = (data, passPhrase = null) => {
  // Arrange the array by key alphabetically for API calls
  let ordered_data = {};
  Object.keys(data).sort().forEach(key => {
    ordered_data[key] = data[key];
  });

  // Create the get string
  let getString = '';
  for (let key in ordered_data) {
    getString += key + '=' + encodeURIComponent(ordered_data[key]).replace(/%20/g, '+') + '&';
  }

  // Remove the last '&'
  getString = getString.slice(0, -1);

  // Append passphrase if provided
  if (passPhrase) {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  }

  // Hash the data and create the signature
  return crypto.createHash('md5').update(getString).digest('hex');
};

const generatePayFastRedirectUrl = ({ amount, name, email }) => {
  const paymentData = {
    merchant_id: process.env.MERCHANT_ID,
    merchant_key: process.env.MERCHANT_KEY,
    return_url: process.env.RETURN_URL,
    cancel_url: process.env.CANCEL_URL,
    notify_url: process.env.NOTIFY_URL, 
    amount:  '899.00',     //parseFloat(amount).toFixed(2), // Ensure amount is formatted correctly
    item_name: "test_item", 
    item_description: "This is a test item.",
    name_first: "John",
    name_last: name,
    email_address: email,
   
  };

  const signature = generateAPISignature(paymentData, process.env.PASSPHRASE);
  paymentData.signature = signature;

  const paymentUrl = `https://www.payfast.co.za/eng/process?${qs.stringify(paymentData)}`;
  return paymentUrl;
};

const verifySignature = (data, passphrase) => {
  // Remove the signature from the data to verify
  const receivedSignature = data.signature;
  delete data.signature;

  let ordered_data = {};
  Object.keys(data).sort().forEach(key => {
    ordered_data[key] = data[key];
  });

  let getString = '';
  for (let key in ordered_data) {
    getString += key + '=' + encodeURIComponent(ordered_data[key]).replace(/%20/g, '+') + '&';
  }

  getString = getString.slice(0, -1);
  if (passphrase !== null) {
    getString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`;
  }

  const generatedSignature = crypto.createHash('md5').update(getString).digest('hex');
  return generatedSignature === receivedSignature;
};

module.exports = {
  generatePayFastRedirectUrl,
  verifySignature,
};

