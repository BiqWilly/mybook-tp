const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  reason: {
    type: String, // e.g., "Based on your course: Information Technology"
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);