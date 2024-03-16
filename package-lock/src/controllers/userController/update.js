const mongoose = require('mongoose');

const update = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  let { email, name, photo, surname, role } = req.body;

  if (role === 'owner') {
    return res.status(403).send({
      success: false,
      result: null,
      message: "you can't update user with role owner",
    });
  }

  let updates = { email, photo, name, surname };

  const result = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  }).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No Document Found.',
    });
  }
  return res.status(200).json({
    success: true,
    result,
    message: 'Document Updated Successfully.',
  });
};

module.exports = update;
