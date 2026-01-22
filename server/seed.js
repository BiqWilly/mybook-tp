const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');

dotenv.config();

const books = [
  { 
    title: "Atomic Habits", 
    author: "James Clear", 
    genre: "Self-Improvement", 
    publicationYear: 2018, 
    description: "A supreme guide to building good habits and breaking bad ones by focusing on tiny changes that lead to remarkable results.", 
    totalCopies: 10, 
    availableCopies: 0, 
    status: "Require Queue", 
    location: "Level 3, Shelf B12", 
    image: "https://m.media-amazon.com/images/I/91bYsX41hOL.jpg" 
  },
  { 
    title: "Dune", 
    author: "Frank Herbert", 
    genre: "Science Fiction", 
    publicationYear: 1965, 
    description: "The epic masterpiece of planetary exploration and political intrigue in a desert world where the only value is 'spice'.", 
    totalCopies: 5, 
    availableCopies: 5, 
    status: "Available", 
    location: "Level 4, Shelf F2", 
    image: "https://m.media-amazon.com/images/I/81S65i30vXL.jpg" 
  },
  { 
    title: "The Great Gatsby", 
    author: "F. Scott Fitzgerald", 
    genre: "Classic Literature", 
    publicationYear: 1925, 
    description: "A classic tale of ambition, love, and the American dream in the Roaring Twenties.", 
    totalCopies: 3, 
    availableCopies: 3, 
    status: "Available", 
    location: "Level 1, Shelf D1", 
    image: "https://m.media-amazon.com/images/I/81QuEGw8VPL.jpg" 
  },
  { 
    title: "Deep Work", 
    author: "Cal Newport", 
    genre: "Productivity", 
    publicationYear: 2016, 
    description: "Rules for focused success in a distracted world. Essential for students and professionals.", 
    totalCopies: 4, 
    availableCopies: 0, 
    status: "Unavailable", 
    location: "Level 3, Shelf A2", 
    image: "https://m.media-amazon.com/images/I/417yjF+E5zL.jpg" 
  },
  { 
    title: "Sapiens", 
    author: "Yuval Noah Harari", 
    genre: "History", 
    publicationYear: 2011, 
    description: "A brief history of humankind, exploring how biology and history have defined us.", 
    totalCopies: 8, 
    availableCopies: 0, 
    status: "Require Queue", 
    location: "Level 6, Shelf H1", 
    image: "https://m.media-amazon.com/images/I/713jIoMO3UL.jpg" 
  },
  { 
    title: "The Alchemist", 
    author: "Paulo Coelho", 
    genre: "Philosophy", 
    publicationYear: 1988, 
    description: "A fable about following your dream and listening to your heart.", 
    totalCopies: 12, 
    availableCopies: 12, 
    status: "Available", 
    location: "Level 1, Shelf A0", 
    image: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg" 
  },
  { 
    title: "The Silent Patient", 
    author: "Alex Michaelides", 
    genre: "Thriller", 
    publicationYear: 2019, 
    description: "A shocking psychological thriller of a woman’s act of violence against her husband.", 
    totalCopies: 6, 
    availableCopies: 6, 
    status: "Available", 
    location: "Level 5, Shelf H9", 
    image: "https://m.media-amazon.com/images/I/81jjfF9mS+L.jpg" 
  },
  { 
    title: "Thinking, Fast and Slow", 
    author: "Daniel Kahneman", 
    genre: "Psychology", 
    publicationYear: 2011, 
    description: "A deep dive into the two systems that drive the way we think: fast and slow.", 
    totalCopies: 4, 
    availableCopies: 2, 
    status: "Available", 
    location: "Level 6, Shelf S3", 
    image: "https://m.media-amazon.com/images/I/71f6vS7T4rL.jpg" 
  },
  { 
    title: "1984", 
    author: "George Orwell", 
    genre: "Dystopian", 
    publicationYear: 1949, 
    description: "A social science fiction novel and cautionary tale about totalitarianism.", 
    totalCopies: 7, 
    availableCopies: 7, 
    status: "Available", 
    location: "Level 1, Shelf O9", 
    image: "https://m.media-amazon.com/images/I/71k00+Hp+XL.jpg" 
  },
  { 
    title: "Educated", 
    author: "Tara Westover", 
    genre: "Memoir", 
    publicationYear: 2018, 
    description: "An unforgettable memoir about a young girl who leaves her survivalist family for university.", 
    totalCopies: 5, 
    availableCopies: 0, 
    status: "Require Queue", 
    location: "Level 6, Shelf E4", 
    image: "https://m.media-amazon.com/images/I/81WojUxbbFL.jpg" 
  },
  { 
    title: "Zero to One", 
    author: "Peter Thiel", 
    genre: "Business", 
    publicationYear: 2014, 
    description: "Notes on startups, or how to build the future by thinking for yourself.", 
    totalCopies: 2, 
    availableCopies: 0, 
    status: "Require Queue", 
    location: "Level 2, Shelf B1", 
    image: "https://m.media-amazon.com/images/I/71mU281m2tL.jpg" 
  },
  { 
    title: "The Lean Startup", 
    author: "Eric Ries", 
    genre: "Business", 
    publicationYear: 2011, 
    description: "How constant innovation creates radically successful businesses.", 
    totalCopies: 3, 
    availableCopies: 3, 
    status: "Available", 
    location: "Level 2, Shelf L2", 
    image: "https://m.media-amazon.com/images/I/81-QB7nDh4L.jpg" 
  },
  { 
    title: "Never Split the Difference", 
    author: "Chris Voss", 
    genre: "Negotiation", 
    publicationYear: 2016, 
    description: "Negotiating as if your life depended on it. Lessons from an FBI hostage negotiator.", 
    totalCopies: 3, 
    availableCopies: 0, 
    status: "Unavailable", 
    location: "Level 2, Shelf V5", 
    image: "https://m.media-amazon.com/images/I/91f6y7jL6yL.jpg" 
  }
];
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    
    // IMPORTANT: This clears the old small list first
    await Book.deleteMany({}); 
    
    await Book.insertMany(books);
    console.log("13 Books successfully added!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();