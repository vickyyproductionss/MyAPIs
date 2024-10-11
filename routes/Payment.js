const express = require('express');
const {CapturePayment} = require('../controllers/Payment');

const router = express.Router();

//REST APIs
router.route("/payment/verification").post(CapturePayment);

module.exports = router;