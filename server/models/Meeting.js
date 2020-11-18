const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    studentsPresent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
