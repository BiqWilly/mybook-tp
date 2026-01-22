const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
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
  queue_position: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["queued", "ready_for_pickup", "cancelled", "expired"],
    default: "queued"
  },
  reservation_date: {
    type: Date,
    default: Date.now // Record of when the spot was taken
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);