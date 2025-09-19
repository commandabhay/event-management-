const router = require('express').Router();
let RSVP = require('../models/rsvp.model');

// Get all RSVPs or filter by eventId
router.route('/').get((req, res) => {
    const { eventId } = req.query;
    
    if (eventId) {
        // Get RSVPs for a specific event
        RSVP.find({ eventId })
            .then(rsvps => res.json(rsvps))
            .catch(err => res.status(400).json('Error: ' + err));
    } else {
        // Get all RSVPs
        RSVP.find()
            .then(rsvps => res.json(rsvps))
            .catch(err => res.status(400).json('Error: ' + err));
    }
});

// Add a new RSVP
router.route('/add').post((req, res) => {
    const newRSVP = new RSVP(req.body);

    newRSVP.save()
        .then(() => res.json('RSVP added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Get RSVPs by event ID
router.route('/event/:eventId').get((req, res) => {
    RSVP.find({ eventId: req.params.eventId })
        .then(rsvps => res.json(rsvps))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;