const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true }, // The user's name
  authorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // This links the post to a real User
    required: true 
  },
  upvotes: { type: Number, default: 0 },
  comments: [
    {
      author: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true }); // This automatically adds 'createdAt' and 'updatedAt'

module.exports = mongoose.model('Post', PostSchema);