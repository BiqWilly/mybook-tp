const User = require('../models/User');

exports.toggleLike = async (req, res) => {
  const { userId, bookId } = req.body;
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize array if it doesn't exist
    if (!user.likedBooks) {
      user.likedBooks = [];
    }

    // Convert to strings for accurate comparison
    const bookIdStr = bookId.toString();
    const likedBooksStr = user.likedBooks.map(id => id.toString());

    const index = likedBooksStr.indexOf(bookIdStr);

    if (index === -1) {
      user.likedBooks.push(bookId); 
    } else {
      user.likedBooks.splice(index, 1);
    }

    await user.save();
    
    // Send response and STOP execution
    return res.status(200).json(user.likedBooks); 

  } catch (err) {
    console.error("Backend ToggleLike Error:", err);
    // Ensure we only send one response
    if (!res.headersSent) {
      return res.status(500).json({ message: err.message });
    }
  }
};