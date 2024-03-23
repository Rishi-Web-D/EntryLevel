const mongoose = require('mongoose');

const task = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  taskName: {
    type: String,
    required: true
  },
  taskType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Done'],
    required: true
  }
});

module.exports = mongoose.model('Task', task);
