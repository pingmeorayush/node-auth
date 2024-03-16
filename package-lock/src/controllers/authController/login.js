const Joi = require('joi');

const mongoose = require('mongoose');
const authUser = require('./authUser');

const login = async (userModel, req, res) => {
  const UserPasswordModel = mongoose.model(`${userModel}Password`);
  const User = mongoose.model(userModel);
  const { email, password } = req.body;
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({ email, password });

  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  const user = await User.findOne({ email });
  console.log('user is: ', user);
  if (!user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  if (!user.enabled)
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Your account is disabled, contact your account adminstrator',
    });
  const databasePassword = await UserPasswordModel.findOne({
    user: user._id,
    removed: false,
  });

  console.log('databasePassword: ', databasePassword);
  authUser(req, res, { user, databasePassword, password, UserPasswordModel });
};

module.exports = login;
