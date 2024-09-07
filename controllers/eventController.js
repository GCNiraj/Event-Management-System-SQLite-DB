const Event = require('../models/eventModel')
const AppError = require('../Event-Management-System/utils/appError')

exports.getAllEvents = async (req, res ,next) => {
    try {
        const events = await Event.findAll()
        res.status(200).json({data: events, status: 'success'})
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.json({data: event, status:"success"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.getEvent = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id); // Find event by primary key
        if (!event) {
            return next(new AppError('Event not found', 404));
        }
        res.status(200).json({
            status: 'success',
            data: { event }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.update(req.body, {
            where: { eventid: req.params.id },
            returning: true
        });

        if (event[0] === 0) { // No rows were affected
            return next(new AppError('Event not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { event: event[1][0] }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.destroy({
            where: { eventid: req.params.id }
        });

        if (!event) {
            return next(new AppError('Event not found', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
