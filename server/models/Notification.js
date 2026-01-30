const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to Users collection
    required: true
  },
  type: {
    type: String,
    enum: ["due_soon", "ready_for_pickup", "queue_update", "announcement"],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  is_read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }); // handles 'created_at' attribute

module.exports = mongoose.model('Notification', notificationSchema);