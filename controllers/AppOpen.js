const AppOpen = require('../models/AppOpen');

async function incrementAppOpen(req, res){
  try {
    const appOpen = await AppOpen.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ count: appOpen.count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
module.exports = {
    incrementAppOpen
}
