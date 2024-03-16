const mongoose = require('mongoose');

const logout = async (userModel, req, res) => {
  const UserPassword = mongoose.model(userModel + 'Password');

  const authorization = req.headers['authorization'] ?? '';

  if (authorization && typeof authorization !== undefined) {
    const bearer = authorization?.split(' ');
    const bearerToken = bearer[1] ?? '';

    if (!bearerToken) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'No authentication token, authorization denied.',
        jwtExpired: true,
      });
    }

    await UserPassword.findOneAndUpdate(
      { user: req.admin._id },
      { $pull: { loggedSessions: bearerToken } },
      {
        new: true,
      },
    ).exec();

    res.json({
      success: true,
      result: {},
      message: 'Successfully logout',
    });
  }
};

module.exports = logout;
