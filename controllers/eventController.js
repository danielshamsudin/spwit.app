const Event = require('../models/Event.js');

exports.createEvent = async (req, res) => {
    const {event, items, tax} = req.body;

    try {
        const newEvent = new Event({
            event,
            items,
            tax
        });

        await newEvent.save()
        res.status(201).json({
            message: "Event created successfully",
            event: newEvent
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const totalWithTax = event.calculateTotalWithTax();

        res.status(200).json({
            event: event.event,
            date: event.date,
            items: event.items,
            tax: event.tax,
            totalWithTax: Math.round((totalWithTax + Number.EPSILON) * 100) / 100
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
