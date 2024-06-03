const AppOpen = require("../models/AppOpen");
const User = require("../models/user");

async function incrementAppOpen(req, res) {
  try {
    const appOpen = await AppOpen.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ count: appOpen.count });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
}
async function fetchprankedusers(req, res) {
  try {
    const senderFromId = req.params.senderFromId;
    const users = await User.find({ sender_from_id: senderFromId });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found with the specified sender_from_id" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
}
module.exports = {
  incrementAppOpen,
  fetchprankedusers,
};