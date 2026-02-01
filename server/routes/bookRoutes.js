const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { getBooks, createBook, borrowBook } = require('../controllers/bookController');

// 1. GET ALL BOOKS
router.get('/', getBooks);

// 2. GET ALL BORROWINGS
router.get('/borrowings/all', async (req, res) => {
    try {
        const Borrowing = require('../models/Borrowing');
        const borrowings = await Borrowing.find()
            .populate('book_id')
            .populate('user_id', 'name');
        res.json(borrowings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. CREATE BOOK 
router.post('/', createBook);

// 4. BORROW BOOK
router.post('/borrow', borrowBook);

// 5. RETURN BOOK
// Always put specific words like /return/ BEFORE dynamic variables like /:id
router.put('/return/:id', async (req, res) => {
    try {
        const Borrowing = require('../models/Borrowing');
        const borrowing = await Borrowing.findById(req.params.id);
        if (!borrowing) return res.status(404).json({ message: "Loan not found" });

        borrowing.status = 'returned';
        await borrowing.save();

        const book = await Book.findById(borrowing.book_id);
        book.availableCopies += 1;
        if (book.availableCopies > 0) book.status = "Available";
        
        await book.save();
        res.json({ message: "Book returned successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. UPDATE BOOK DETAILS (UPDATE - General Path)
router.put('/:id', async (req, res) => {
  console.log("PUT Request received for ID:", req.params.id);
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } 
    );
    if (!updatedBook) return res.status(404).json({ message: "Book not found in DB" });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. DELETE BOOK (DELETE)
router.delete('/:id', async (req, res) => {
  console.log("DELETE Request received for ID:", req.params.id);
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found in DB" });
    res.json({ message: "Book removed from catalog" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;