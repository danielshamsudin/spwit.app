const express = require('express')
const { createEvent, getEvent } = require('../controllers/eventController')
const auth = require('../middleware/auth')
const router = express.Router();

router.post('/event', auth, createEvent);
router.get('/event/:id', auth, getEvent);

module.exports = router;
