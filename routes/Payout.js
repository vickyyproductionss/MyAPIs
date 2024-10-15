const express = require('express');
const {createPayout} = require('../controllers/Payout');

const router = express.Router();

//REST APIs
router.route("/").get(createPayout);

module.exports = router;