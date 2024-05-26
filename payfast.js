const crypto = require('crypto');

const PAYFAST_MERCHANT_ID = 'your-merchant-id';
const PAYFAST_MERCHANT_KEY = 'your-merchant-key';
const PAYFAST_PASSPHRASE = 'your-passphrase'; // Only if using one
const PAYFAST_URL = 'https://www.payfast.co.za/eng/process';

const createSignature = (data, passphrase) => {
    const queryString = Object.keys(data)
        .sort()
        .map(key => `${key}=${encodeURIComponent(data[key])}`)
        .join('&');
    const md5 = crypto.createHash('md5').update(queryString);
    if (passphrase) {
        md5.update(`&passphrase=${passphrase}`);
    }
    return md5.digest('hex');
};

const generatePayFastRedirectUrl = ({ amount, name, email }) => {
    const data = {
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        return_url: 'http://your-website.com/success',
        cancel_url: 'http://your-website.com/cancel',
        notify_url: 'http://your-website.com/notify',
        name_first: name,
        email_address: email,
        amount: amount,
        item_name: 'Test Payment',
    };

    // Add signature
    data.signature = createSignature(data, PAYFAST_PASSPHRASE);

    const redirectUrl = `${PAYFAST_URL}?${Object.keys(data)
        .map(key => `${key}=${encodeURIComponent(data[key])}`)
        .join('&')}`;

    return redirectUrl;
};

const verifySignature = (data, passphrase) => {
    const signature = data.signature;
    delete data.signature;
    return signature === createSignature(data, passphrase);
};

module.exports = {
    generatePayFastRedirectUrl,
    verifySignature,
};
