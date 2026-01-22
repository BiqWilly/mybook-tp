const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrow_date: { type: Date, default: Date.now },
  due_date: { type: Date, required: true },
  status: { type: String, enum: ['active', 'returned'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Borrowing', borrowingSchema);