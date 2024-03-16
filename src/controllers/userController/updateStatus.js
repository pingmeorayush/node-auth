const mongoose = require('mongoose');

/**
 * Function to activate or deactivate the user.
 * @param {*} userModel
 * @param {*} req
 * @param {*} res
 */
const updateStatus = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  const enabled = req.body.enabled || false;

  if (enabled === true || enabled === false) {
    let updates = {
      enabled,
    };
    const result = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: updates,
      },
      {
        new: true,
      },
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found',
      });
    }

    return res.json({
      success: true,
      result,
      message: 'Status updated successfully.',
    });
  } else {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Missing fields',
    });
  }
};

module.exports = updateStatus;
