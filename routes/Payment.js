const express = require('express');
const {CapturePayment,CreatePaymentLink} = require('../controllers/Payment');

const router = express.Router();

//REST APIs
router.route("/").get(CreatePaymentLink).post(CapturePayment);

module.exports = router;