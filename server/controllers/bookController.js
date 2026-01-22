const Book = require('../models/Book');
const Borrowing = require('../models/Borrowing');

// 1. Get All Books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Create a Book (Added this for you!)
exports.createBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 3. Borrow Book Logic
exports.borrowBook = async (req, res) => {
  const { book_id, user_id, days } = req.body;
  try {
    const book = await Book.findById(book_id);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book is no longer available." });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(days));

    const newBorrowing = new Borrowing({
      user_id,
      book_id,
      due_date: dueDate
    });
    await newBorrowing.save();

    book.availableCopies -= 1;
    if (book.availableCopies === 0) {
      book.status = "Require Queue";
    }
    await book.save();

    res.status(200).json({ message: "Borrowed successfully!", dueDate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};