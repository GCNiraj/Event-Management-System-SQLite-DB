const express = require('express')
const eventController = require('./../controllers/eventController')
const router = express.Router()

router
    .route('/')
    .post(eventController.createEvent)
    .get(eventController.getAllEvents)


router
    .route('/:id')
    .get(eventController.getEvent)
    .patch(eventController.updateEvent)
    .delete(eventController.deleteEvent);

router.put('/updateBanner',eventController.uploadEventBanner, eventController.uploadEventImage)
    
module.exports = router