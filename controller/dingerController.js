const controller = {};
const NodeRSA = require('node-rsa');
const crypto = require('crypto');
const axios = require('axios');

controller.getDingerUrl = async function(req, res) {

    // res.status(200).json({ message: "delete user successfully" });

    const dingerBaseUrl = req.body.dinger_base_url;
    const dingerPublicKey = req.body.public_key;
    const dingerMerchantApiKey = req.body.dinger_merchant_api_key;
    const dingerSecretKey= req.body.dinger_secret_key;
    const dingerClientId = req.body.dinger_client_id;
    const dingerProjectName = req.body.dinger_project_name;
    const dingerMerchantName = req.body.dinger_merchant_name;
    const customerName = req.body.customer_name;
    

    const publicKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCFD4IL1suUt/TsJu6zScnvsEdLPuACgBdjX82QQf8NQlFHu2v/84dztaJEyljv3TGPuEgUftpC9OEOuEG29z7z1uOw7c9T/luRhgRrkH7AwOj4U1+eK3T1R+8LVYATtPCkqAAiomkTU+aC5Y2vfMInZMgjX0DdKMctUur8tQtvkwIDAQAB-----END PUBLIC KEY-----';
  const total_amount = 100; //amount * quantity
    const items_data = [{
        name: "testing user",
        amount: 50,
        type: 'Ice',
        quantity: 2,
      }];

      const data_pay = JSON.stringify({
        "clientId": dingerClientId,
        "publicKey": dingerPublicKey,
        "items": JSON.stringify(items_data),
        "customerName": customerName,
        "totalAmount": total_amount,
        "merchantOrderId": 11,
        "merchantKey": dingerMerchantApiKey,
        "projectName": dingerProjectName,
        "merchantName": dingerMerchantName
      })
  
      const key = new NodeRSA();
      key.importKey(publicKey, 'pkcs8-public')
      key.setOptions({ encryptionScheme: 'pkcs1' });
      const ciphertext = key.encrypt(data_pay, 'base64');

      const urlencode_value = encodeURIComponent(ciphertext);

      const hmac = crypto.createHmac('sha256', dingerSecretKey);
      hmac.update(data_pay);
      const encryptedHashValue = hmac.digest('hex');

      const redirectLink = `${dingerBaseUrl}/?hashValue=${encryptedHashValue}&payload=${urlencode_value}`;
      res.json({ url: redirectLink, message: 'Data success!' });
}
controller.dingerSuccess = async function(req, res) {
  res.json({ message: 'Data success'})
}
controller.payDataLoad = async function(req, res) {
  const items = [{ name: "Dinger", amount: 100, quantity: 2 }];
  const data = JSON.stringify({
    providerName: "KBZ Pay",
    methodName: "QR",
    orderId: "hnt-11092021034",
    customerPhone: "09956459552",
    customerName: "Hsu Nyeint Thu",
    description: "Dinger Campaign Test",
    customerAddress: "Yangon, Myanmar",
    totalAmount: 200,
    items: JSON.stringify(items),
  });

  const pubKey = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJtu2coOqkFaaxLtlnb6DAQRvw+6l9iwm6RZlGrAf6IUnZiJavYi60hTveLkFbeYLvvLcFyIGddQDUJBCvEOIk7GwgF6pPRlV9k5g7CDyHbqsjudOix+ElD2XkAiUeYWAK++uRVBqcE/xxwNMDoRwyYqoC/OifZf0pH7PA3XCUyQIDAQAB-----END PUBLIC KEY-----";

  const publicKey = new NodeRSA();
  publicKey.importKey(pubKey, "pkcs8-public");
  publicKey.setOptions({ encryptionScheme: "pkcs1" });
  const encrytpStr = publicKey.encrypt(data, "base64");
  
  const param = { payload: encrytpStr };
  const payloadData = new URLSearchParams(param);

  const url = 'https://staging.dinger.asia/payment-gateway-uat/api/pay'
  try {
    const response = await axios.post(url, payloadData, {
      headers: { 'Authorization': 'Bearer 4439ff4b-0f92-43e4-a41e-739f0e01a95f' }
    });
    console.log(response.data);
    res.json({message: response.data})
  } catch (error) {
    console.error('Error:', error);
  }
}
controller.changeQr = (req, res) => {
  // const qrCode = '000201010212504000245e4655c7764f2262995504d80108AYAPAYMM514800245ecb2e6e04fe33e03cca09e20116200000462000004652040763540410005303MMK5802MM5906DINGER6006Yangon625201040289051211263302189750245e216cc54d067ef2b7adafb264160002my0106DINGER63041d02'
  // const fs = require('fs');
  // const QRCode = require('qrcode');
  let data = '';
  const qr = require('qrcode');
  const qrCodeData = req.params.code;
  qr.toDataURL(qrCodeData, (err, url) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('success')
    data = url
    res.json({ message: url});
    console.log(data);
  });
  
}

module.exports = controller;

