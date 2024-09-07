const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const app = require('./app')
const db = require("./models/db")
const winston = require('winston/lib/winston/config')

/* Test DB connection */
db.authenticate().then(() => console.log("SQLite connected")).catch(err => console.log('Error: '+err))


/* Starting the port on port 4001. */
const port = 4001
app.listen(port, ()=>{
    console.log(`App running on port ${port} ..`)
})