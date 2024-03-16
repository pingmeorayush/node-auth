const login = require('./login');
const logout = require('./logout');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');

const userModel = 'Admin';

const createAuthController = () => {
  let authController = {};
  authController.login = (req, res) => login(userModel, req, res);
  authController.logout = (req, res) => logout(userModel, req, res);
  authController.forgotPassword = (req, res) =>
    forgotPassword(userModel, req, res);
  authController.resetPassword = (req, res) =>
    resetPassword(userModel, req, res);
  return authController;
};

module.exports = createAuthController;
