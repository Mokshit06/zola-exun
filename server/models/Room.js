const mongoose = require('mongoose');
const MessageSchema = require('./Message');

const RoomSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  }
);

RoomSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'room',
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
