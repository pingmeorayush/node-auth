const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authUser = async (
  req,
  res,
  { user, databasePassword, password, UserPasswordModel },
) => {
  const isMatch = await bcrypt.compare(
    databasePassword.salt + password,
    databasePassword.password,
  );

  if (!isMatch)
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Invalid credentials.',
    });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // prettier-ignore
  await UserPasswordModel.findOneAndUpdate(
      {
        user: user._id,
      },
      {
        $push: { loggedSessions: token },
      },
      { new: true },
    )
    .exec();

  res.send({
    success: true,
    result: {
      user,
      token,
    },
    message: 'Successfully login user',
  });
};

module.exports = authUser;
