const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const mongoose = require('mongoose');

const shortid = require('shortid');

const resetPassword = async (userModel, req, res) => {
  const UserPassword = mongoose.model(userModel + 'Password');
  const User = mongoose.model(userModel);
  const { password, userId, resetToken } = req.body;

  const databasePassword = await UserPassword.findOne({
    user: userId,
    removed: false,
  });
  const user = await User.findOne({ _id: userId, removed: false }).exec();

  if (!user.enabled)
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Your account is disabled, contact your account adminstrator',
    });

  if (!databasePassword || !user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  const isMatch = resetToken === databasePassword.resetToken;
  if (
    !isMatch ||
    databasePassword.resetToken === undefined ||
    databasePassword.resetToken === null
  )
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Invalid reset token',
    });

  // validate
  const objectSchema = Joi.object({
    password: Joi.string().required(),
    userId: Joi.string().required(),
    resetToken: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({
    password,
    userId,
    resetToken,
  });

  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid reset password object',
      errorMessage: error.message,
    });
  }

  const salt = shortid.generate();
  const hashedPassword = bcrypt.hashSync(salt + password);
  const emailToken = shortid.generate();

  const token = jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' },
  );

  await UserPassword.findOneAndUpdate(
    { user: userId },
    {
      $push: { loggedSessions: token },
      password: hashedPassword,
      salt: salt,
      emailToken: emailToken,
      resetToken: shortid.generate(),
      emailVerified: true,
    },
    {
      new: true,
    },
  ).exec();

  if (
    resetToken === databasePassword.resetToken &&
    databasePassword.resetToken !== undefined &&
    databasePassword.resetToken !== null
  )
    return res.status(200).json({
      success: true,
      result: {
        user,
        token,
      },
      message: 'Successfully resetPassword user',
    });
};

module.exports = resetPassword;
