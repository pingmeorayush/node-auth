const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

const isValidAuthToken = async (userModel, req, res, next) => {
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
    try {
      const User = mongoose.model(userModel);
      const UserPassword = mongoose.model(`${userModel}Password`);
      const verified = jwt.verify(bearerToken, process.env.JWT_SECRET);

      if (!verified) {
        return res.status(401).json({
          success: false,
          result: null,
          message: 'Token verification failed, authorization denied.',
          jwtExpired: true,
        });
      }

      const userPasswordPromise = UserPassword.findOne({
        user: verified.id,
        removed: false,
      });

      const userPromise = User.findOne({ _id: verified.id, removed: false });

      const [user, userPassword] = await Promise.all([
        userPromise,
        userPasswordPromise,
      ]);

      if (!user) {
        return res.status(401).json({
          success: false,
          result: null,
          message: "User doens't Exist, authorization denied.",
          jwtExpired: true,
        });
      }
      const { loggedSessions } = userPassword;

      if (!loggedSessions.includes(bearerToken)) {
        return res.status(401).json({
          success: false,
          result: null,
          message: 'User is already logout try to login, authorization denied.',
          jwtExpired: true,
        });
      } else {
        const reqUserName = userModel.toLowerCase();
        req[reqUserName] = user;
        next();
      }
    } catch (error) {
      return res.status(503).json({
        success: false,
        result: null,
        message: error.message,
        error: error,
        controller: 'isValidAuthToken',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      result: null,
      message: 'No authentication token, authorization denied.',
      jwtExpired: true,
    });
  }
};

module.exports = isValidAuthToken;
