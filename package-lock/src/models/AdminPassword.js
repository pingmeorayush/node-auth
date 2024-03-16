const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Admin = require('./Admin');

const adminPasswordSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: Admin,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  emailToken: String,
  resetToken: String,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  authType: {
    type: String,
    default: 'email',
  },
  loggedSessions: {
    type: [String],
    default: [],
  },
});

// generating a hash
adminPasswordSchema.methods.generateHash = function (salt, password) {
  return bcrypt.hashSync(salt + password);
};

//password validation
adminPasswordSchema.methods.validPassword = function (salt, userpassword) {
  return bcrypt.compareSync(salt + userpassword, this.password);
};

module.exports = mongoose.model('AdminPassword', adminPasswordSchema);
