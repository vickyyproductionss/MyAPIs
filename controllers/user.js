const User = require('../models/user')
const axios = require('axios');
async function handleGetAllUsers(req,res)
{
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
}
async function handleGetUserById(req,res)
{
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({error:"user not found"});
    return res.json(user); 
}
async function handleUpdateUserById(req,res)
{
    await User.findByIdAndUpdate(req.params.id,{lastName:"Changed"});
    return res.json({status:"success"});
}
async function handleDeleteUserById(req,res)
{
    await User.findByIdAndDelete(req.params.id);
    return res.json({status:"success"});
}
async function handleCreateNewUser(req,res)
{
    const body = req.body;
    if(
        !body ||
        !body.sender_name ||
        !body.sender_crushname ||
        !body.email ||
        !body.sender_id
    )
    {
        return res.status(400).json({msg:"All Fields are Required"});
    }
    const result = await User.create({
        sender_id : body.sender_id,
        sender_name:body.sender_name,
        email:body.email,
        sender_crushname:body.sender_crushname,
        sender_from_id:body.sender_from_id || "Self",
    });

    return res.status(201).json({msg: "success",id:result._id});
}

async function handleGetAllUsersInUI(req,res)
{
    try {
        const users = await User.find({});
        res.render('users', { users }); // Render 'users.ejs' template with all users data
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
}
async function handleGetUserProfilePicture(req,res)
{
    const username = "vickyy_chaudharyy";
    try {
        const response = await axios.get(`https://www.instagram.com/${username}/?__a=1`);
        const profileData = response.data.graphql.user;
        const profilePictureUrl = profileData.profile_pic_url_hd; // Use profile_pic_url for lower resolution picture
        return profilePictureUrl;
    } catch (error) {
        console.error('Error fetching profile picture:', error.response.data);
        return null;
    }
}
module.exports = {
    handleGetAllUsers,handleCreateNewUser,handleGetUserById,handleUpdateUserById,handleDeleteUserById,handleGetAllUsersInUI,handleGetUserProfilePicture,
}