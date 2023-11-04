const controller = {};
const NodeRSA = require('node-rsa');
const crypto = require('crypto');

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
        "merchantOrderId": 21,
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

module.exports = controller;