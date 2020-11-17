const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    socialId: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
    },
    isTeacher: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
