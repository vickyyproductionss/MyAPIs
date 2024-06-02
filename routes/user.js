const express = require('express');
const {handleGetAllUsers,handleGetUserProfilePicture,handleCreateNewUser, handleGetUserById,handleUpdateUserById,handleDeleteUserById,handleGetAllUsersInUI} = require('../controllers/user');
const {incrementAppOpen} = require("../controllers/AppOpen")
const {incrementHitCounter} = require('../controllers/hitCounterController');
const router = express.Router();

//REST APIs
router.route("/").get(handleGetAllUsers).post(handleCreateNewUser);

router
    .route("/:id")
    .get(handleGetUserById)
    .patch(handleUpdateUserById)
    .delete(handleDeleteUserById);

router
    .route("/ui")
    .get(handleGetAllUsersInUI);

router
    .route("/username")
    .get(handleGetUserProfilePicture);


router.route("/appopen").get(incrementAppOpen);
router.route("/hitlink").get(incrementHitCounter);

module.exports = router;