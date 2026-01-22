const express = require('express');
const router = express.Router();
const { joinQueue, cancelReservation, getAllReservations } = require('../controllers/reservationController');

// Added the GET route here
router.get('/', getAllReservations); 
router.post('/join', joinQueue);
router.put('/cancel/:id', cancelReservation);

module.exports = router;