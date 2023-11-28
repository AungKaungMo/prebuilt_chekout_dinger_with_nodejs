const express = require('express');
const router = express.Router();
const controller = require("../controller/indexController.js");

router.post('/dingerPayment', controller.dingerPayment.getDingerUrl);
router.get('/dingerSuccess', controller.dingerPayment.dingerSuccess);
router.post('/dingerPayload', controller.dingerPayment.payDataLoad);
router.get('/qrdecode/:code', controller.dingerPayment.changeQr);

module.exports = router;