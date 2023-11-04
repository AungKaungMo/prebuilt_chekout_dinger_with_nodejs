const express = require('express');
const router = express.Router();
const controller = require("../controller/indexController.js");

router.post('/dingerPayment', controller.dingerPayment.getDingerUrl);
router.get('/dingerSuccess', controller.dingerPayment.dingerSuccess )

module.exports = router;