const express = require('express');
const {handleGetAllUsers,handleCreateNewUser, handleGetUserById,handleUpdateUserById,handleDeleteUserById,handleGetAllUsersInUI} = require('../controllers/user');

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

module.exports = router;