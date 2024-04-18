const express = require('express');
const {handleGetAllUsers,handleCreateNewUser, handleGetUserById,handleUpdateUserById,handleDeleteUserById} = require('../controllers/user');

const router = express.Router();

//REST APIs
router.route("/").get(handleGetAllUsers).post(handleCreateNewUser);

router
    .route("/:id")
    .get(handleGetUserById)
    .patch(handleUpdateUserById)
    .delete(handleDeleteUserById);

module.exports = router; 