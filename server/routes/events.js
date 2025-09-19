const router = require('express').Router();
let Event = require('../models/event.model');

// Get all events
router.route('/').get((req, res) => {
    Event.find()
        .then(events => res.json(events))
        .catch(err => res.status(400).json({ message: 'Error fetching events', error: err }));
});

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Events API is working!', timestamp: new Date().toISOString() });
});

// Add a new event
router.route('/add').post((req, res) => {
    try {
        // Validate required fields
        if (!req.body.organizerId) {
            return res.status(400).json({ message: 'organizerId is required' });
        }

        // Convert string dates to Date objects for MongoDB
        const eventData = {
            ...req.body,
            date: new Date(req.body.date),
            rsvpDeadline: new Date(req.body.rsvpDeadline)
        };

        console.log('Creating event with data:', eventData); // Debug log

        const newEvent = new Event(eventData);

        newEvent.save()
            .then((savedEvent) => {
                console.log('Event created successfully:', savedEvent._id);
                res.status(201).json(savedEvent);
            })
            .catch(err => {
                console.error('Error creating event:', err); // Log the full error on the server
                // Check for Mongoose validation error and send a specific, detailed message back to the client
                if (err.name === 'ValidationError') {
                    // Extracting a cleaner error message
                    const messages = Object.values(err.errors).map(val => val.message);
                    return res.status(400).json({ message: 'Validation Error', errors: messages });
                }
                // For other types of errors
                res.status(400).json({ message: 'Error creating event', error: err.message });
            });
    } catch (error) {
        console.error('Error processing event data:', error);
        res.status(400).json({ message: 'Invalid event data', error: error.message });
    }
});

// Update an event by ID
router.route('/update/:id').post((req, res) => {
    try {
        // Convert string dates to Date objects for MongoDB
        const updateData = {
            ...req.body,
            date: req.body.date ? new Date(req.body.date) : undefined,
            rsvpDeadline: req.body.rsvpDeadline ? new Date(req.body.rsvpDeadline) : undefined
        };

        console.log('Updating event with data:', updateData); // Debug log

        Event.findById(req.params.id)
            .then(event => {
                if (!event) {
                    return res.status(404).json({ message: 'Event not found' });
                }
                Object.assign(event, updateData);

                event.save()
                    .then((updatedEvent) => {
                        console.log('Event updated successfully:', updatedEvent._id);
                        res.json(updatedEvent);
                    })
                    .catch(err => {
                        if (err.name === 'ValidationError') {
                            const messages = Object.values(err.errors).map(val => val.message);
                            return res.status(400).json({ message: 'Validation Error', errors: messages });
                        }
                        res.status(400).json({ message: 'Error updating event', error: err.message });
                    });
            })
            .catch(err => res.status(400).json({ message: 'Error finding event', error: err }));
    } catch (error) {
        console.error('Error processing update data:', error);
        res.status(400).json({ message: 'Invalid update data', error: error.message });
    }
});

// Delete an event by ID
router.route('/:id').delete((req, res) => {
    Event.findByIdAndDelete(req.params.id)
        .then(() => res.json('Event deleted.'))
        .catch(err => res.status(400).json({ message: 'Error deleting event', error: err }));
});

// Get an event by ID (must be last to avoid conflicts with specific routes)
router.route('/:id').get((req, res) => {
    Event.findById(req.params.id)
        .then(event => res.json(event))
        .catch(err => res.status(400).json({ message: 'Error fetching event', error: err }));
});

module.exports = router;
