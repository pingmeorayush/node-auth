const { default: mongoose } = require('mongoose');
const shortid = require('shortid');
const Joi = require('joi');

const forgotPassword = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  const UserPassword = mongoose.model(`${userModel}Password`);

  const { email } = req.body;

  // validate
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
  });

  const { error, value } = objectSchema.validate({ email });

  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid email.',
      errorMessage: error.message,
    });
  }

  const user = await User.findOne({ email: email, removed: false });
  const databasePassword = await UserPassword.findOne({
    user: user._id,
    removed: false,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });
  }

  if (!user.enabled) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Your account is disabled, contact your account adminstrator',
    });
  }

  const resetToken = shortid.generate();

  await UserPassword.findOneAndUpdate(
    { user: user._id },
    { resetToken },
    {
      new: true,
    },
  ).exec();

  const link = '127.0.0.1:8080/reset-password/' + user._id + '/' + resetToken;

  /**
   * Send email for link verification logic goes here.
   */

  return res.status(200).json({
    success: true,
    result: { link },
    message: 'Check your email inbox , to reset your password',
  });
};
module.exports = forgotPassword;
