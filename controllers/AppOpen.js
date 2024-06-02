const AppOpen = require('../models/AppOpen');

exports.incrementAppOpen = async (req, res) => {
  try {
    let appOpen = await AppOpen.findOne();

    if (!appOpen) {
      appOpen = new AppOpen({ count: 1 });
    } else {
      appOpen.count += 1;
    }

    await appOpen.save();
    res.status(200).json({ count: appOpen.count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
