const express = require('express');
const {CapturePayment,CreateOrderAndPaymentLink} = require('../controllers/Payment');

const router = express.Router();

//REST APIs
router.route("/").get(CreateOrderAndPaymentLink).post(CapturePayment);

module.exports = router;