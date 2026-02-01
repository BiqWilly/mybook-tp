const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const reservationRoutes = require('./routes/ReservationRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);

app.get('/api', (req, res) => {
  res.send('MyBook TP API is running...');
});


const PORT = process.env.PORT || 5000; // fallback for local dev

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
//testing for CD frontend deployment
module.exports = app;
