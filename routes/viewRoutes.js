const express = require('express')
const router = express.Router()
const viewsController = require('./../controllers/viewController')
// const authController = require('./../controllers/authController')

router.get('/', viewsController.getHome)
router.get('/signin', viewsController.getLoginForm)
router.get('/signup', viewsController.getSignupForm)
// router.get('/me',authController.protect,viewsController.getProfile)

/* Event routes start here */
router.get('/add_event', viewsController.getEventForm) 
router.get('/event_details',viewsController.getEventDetails)
router.get('/checkout',viewsController.getEventCheckout)
router.get('/bookingConfirmed',viewsController.getEventBooking)


module.exports = router