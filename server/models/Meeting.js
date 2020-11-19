const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const MeetingSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    code: {
      type: String,
      default: () => nanoid(10),
    },
    studentsPresent: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        joinedAt: {
          type: String,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Meeting = mongoose.model('Meeting', MeetingSchema);

module.exports = Meeting;
