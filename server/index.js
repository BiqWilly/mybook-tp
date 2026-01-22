const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// routes
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
// const borrowBook = require('./models/Borrowing');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

dotenv.config();
connectDB();


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes); 
app.use('/api/posts', postRoutes);      
app.use('/api/reservations', reservationRoutes);       
// app.use('/api/borrowings', borrowBook);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
    res.send('MyBook TP API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;