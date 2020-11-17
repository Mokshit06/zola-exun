const mongoose = require('mongoose');

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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

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
