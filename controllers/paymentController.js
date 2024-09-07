const Payment = require('../models/paymentModel')
const AppError = require('../utils/appError')

exports.getAllPayments = async (req, res ,next) => {
    try {
        const payments = await Payment.findAll()
        res.status(200).json({data: payments, status: 'success'})
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.registerEvent = async (req, res) => {
    try {
        const registration = await Payment.create(req.body);
        res.json({data: registration, status:"success"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.getPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findByPk(req.params.id); // Find payment by primary key
        if (!payment) {
            return next(new AppError('Payment not found', 404));
        }
        res.status(200).json({
            status: 'success',
            data: { payment }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPaymentsByUserCID = async (req, res, next) => {
    try {
        const payments = await Payment.findAll({
            where: {
                attendee_CID: req.params.cid
            }
        });
        
        if (!payments.length) {
            return next(new AppError('No payments found for this user', 404));
        }

        res.status(200).json({
            status: 'success',
            data: payments
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateTicketuse = async (req, res, next) =>{
    try {
        const payment = await Payment.findByPk(req.params.id);
        console.log(payment)
        payment.pay_status = true
        await payment.save();
        res.json({ data: payment, status: "success"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}