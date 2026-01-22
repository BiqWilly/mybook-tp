const Reservation = require('../models/Reservation');
const Book = require('../models/Book');

// 1. Join the Queue
exports.joinQueue = async (req, res) => {
    try {
        const { book_id, user_id } = req.body;

        // Check if the user is already in the queue for this book to prevent duplicates
        const existing = await Reservation.findOne({ book_id, user_id, status: 'queued' });
        if (existing) {
            return res.status(400).json({ message: "You are already in the queue for this book." });
        }

        // Find how many people are already in the queue for this specific book
        const currentQueueCount = await Reservation.countDocuments({ 
            book_id, 
            status: 'queued' 
        });

        const newReservation = new Reservation({
            user_id,
            book_id,
            queue_position: currentQueueCount + 1,
            status: 'queued'
        });

        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 2. Cancel Reservation & Shift Queue
exports.cancelReservation = async (req, res) => {
    try {
        const { id } = req.params; // Reservation ID
        const canceledRes = await Reservation.findById(id);

        if (!canceledRes) return res.status(404).json({ message: "Reservation not found" });

        const bookId = canceledRes.book_id;
        const positionRemoved = canceledRes.queue_position;

        // 1. Mark current as cancelled
        canceledRes.status = 'cancelled';
        canceledRes.queue_position = 0; // No longer in line
        await canceledRes.save();

        // 2. Shift everyone behind them up by 1
        // This ensures the queue stays consistent (e.g., if #1 leaves, #2 becomes #1)
        await Reservation.updateMany(
            { book_id: bookId, status: 'queued', queue_position: { $gt: positionRemoved } },
            { $inc: { queue_position: -1 } }
        );

        res.json({ message: "Cancelled and queue updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Get all reservations (Needed for Profile page to display queue status)
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};