// controllers/hitCounterController.js

const HitCounter = require('../models/HitCounter');

exports.incrementHitCounter = async (req, res) => {
  const { id } = req.query; // Assuming the id is sent as a query parameter

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    let hitCounter = await HitCounter.findOne({ id });

    if (!hitCounter) {
      hitCounter = new HitCounter({ id, count: 1 });
    } else {
      hitCounter.count += 1;
    }

    await hitCounter.save();
    res.status(200).json({ id: hitCounter.id, count: hitCounter.count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
