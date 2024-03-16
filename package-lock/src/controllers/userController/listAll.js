const mongoose = require('mongoose');

const listAll = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  const result = await User.find({ removed: false, enabled: false })
    .sort({ enabled: -1 })
    .populate()
    .exec();

  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  }
  return res.status(200).json({
    success: false,
    result,
    message: 'Collection is empty',
  });
};

module.exports = listAll;
