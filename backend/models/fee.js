const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Overdue'],
      default: 'Pending',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidOn: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Fee', feeSchema);