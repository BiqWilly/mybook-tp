const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publicationYear: { type: Number, required: true },
  description: { type: String },
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  location: { type: String, default: "Main Shelf" },
  status: { 
    type: String, 
    enum: ["Available", "Require Queue", "Reserved"], 
    default: "Available" 
  },
  image: { type: String }
}, { 
  timestamps: true // This creates the createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Book', bookSchema);