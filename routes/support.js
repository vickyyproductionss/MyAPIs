const express = require('express');
const {handleGetServer,handleSetServer} = require('../controllers/support');

const router = express.Router();

//REST APIs
router.route("/get/server").get(handleGetServer).post(handleSetServer);

module.exports = router;