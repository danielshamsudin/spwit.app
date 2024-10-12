const express = require('express')
const { createEvent, getEvent, getUserEvents, removeEventsFromList, attachOwnerToFood  } = require('../controllers/eventController')
const auth = require('../middleware/auth')
const router = express.Router();

router.post('/event', auth, createEvent);
router.get('/event/:id', auth, getEvent);
router.get('/events', auth, getUserEvents);
router.delete('/event/:id', auth, removeEventsFromList);
router.put('/event/:id', auth, attachOwnerToFood);

module.exports = router;
