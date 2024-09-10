const Event = require('../models/eventModel');
const AppError = require('../utils/appError')
const multer = require('multer')

// Multer storage configuration
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'views/images/banners/user_uploads'); // Update the folder for event images
    },
    filename: (req, file, cb) => {
        const eventid = req.body.eventid; // Use eventid for naming; fallback if not provided
        const ext = file.mimetype.split('/')[1];
        cb(null, `event-${eventid}-${Date.now()}.${ext}`); // Naming convention based on eventid
    }
});

// Multer file filter for image validation
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // Accept only images
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false); // Reject non-images
    }
};

// Multer upload configuration
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

// Middleware to upload a single image (photo field)
exports.uploadEventBanner = upload.single('mediaLink');

// New function to handle image upload and return image URL
exports.uploadEventImage = async (req, res, next) => {
    try {

        // Construct image URL (adjust this path as needed depending on server setup)
        const imageUrl = 'images/banners/user_uploads/' + req.file.filename

        const event = await Event.findByPk(req.body.eventid);
        event.media_Links = imageUrl
        await event.save();

        res.json({data: event, status:"success"})
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.findAll()
        res.status(200).json({ data: events, status: 'success' })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.json({ data: event, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
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

exports.getAvailableSeats = async(req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        res.json({data: event.available_seats, status: "success"})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

exports.updateEventSeats = async(req, res, next) => {
    try{
        const event = await Event.findByPk(req.params.id);
        event.available_seats = req.body.available_seats;
        await event.save();
        res.json({status:"success"})
    }catch(err){
        res.status(500).json({error: err.message});
    }
}