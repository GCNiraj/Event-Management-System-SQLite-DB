const express = require('express')
const paymentController = require('./../controllers/paymentController')
const router = express.Router()

router
    .route('/')
    .post(paymentController.registerEvent)
    .get(paymentController.getAllPayments)

router
    .route('/:id')


router
    .route('/user/:cid')
    .get(paymentController.getPaymentsByUserCID);



module.exports = router