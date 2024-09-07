const express = require("express")
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser')
const logger = require('./logger');

const userRouter = require('./routes/userRoutes')
const eventRouter = require('./routes/eventRoutes')
const paymentRouter = require('./routes/paymentRoutes')
const viewRouter = require('./routes/viewRoutes')

app.use(express.static(path.join(__dirname, 'views')))

app.use(cookieParser())
app.use(express.json())
app.use('/api/v1/users',userRouter)
app.use('/api/v1/events',eventRouter)
app.use('/api/v1/payments', paymentRouter)
app.use('/', viewRouter)

app.use((err, req, res, next) => {
  logger.error(err, err.message);
  res.status(500).send({ message: err.message, error: err });
});

module.exports = app