const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const ClassSchema = new mongoose.Schema(
  {
    grade: {
      type: Number,
    },
    section: {
      type: String,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    code: {
      type: String,
      default: () => nanoid(10),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

ClassSchema.index({ grade: 1, section: 1 }, { unique: true });

ClassSchema.virtual('students', {
  ref: 'User',
  localField: '_id',
  foreignField: 'class',
  match: {
    isTeacher: false,
  },
});

const Class = mongoose.model('Class', ClassSchema);

module.exports = Class;
