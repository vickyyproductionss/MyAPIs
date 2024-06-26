const express = require('express');
const {handleGetAllUsers,handleGetUserProfilePicture,handleCreateNewUser, handleGetUserById,handleUpdateUserById,handleDeleteUserById,handleGetAllUsersInUI} = require('../controllers/user');
const {incrementAppOpen,fetchprankedusers} = require("../controllers/AppOpen")
const {incrementHitCounter} = require('../controllers/hitCounterController');
const router = express.Router();

//REST APIs
router.route("/").get(handleGetAllUsers).post(handleCreateNewUser);

router
    .route("/ui")
    .get(handleGetAllUsersInUI);

router
    .route("/username")
    .get(handleGetUserProfilePicture);


router.route("/appopen").get(incrementAppOpen);
router.route("/prankedlist").get(fetchprankedusers);
router.route("/hitlink").get(incrementHitCounter);

module.exports = router;