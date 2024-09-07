const {DataTypes} = require('sequelize')
const db = require('./db')
const User = require('./userModel');
const Event = require('./eventModel');

const Payment = db.define('Payment', {
    transaction_ID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    attendee_CID: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'cid'
        },
    },
    event_ID: {
        type: DataTypes.UUID,
        references: {
            model: Event,
            key: 'eventid'
        }
    },
    total_Amount:{
        type: DataTypes.INTEGER
    },
    no_of_tickets: {
        type: DataTypes.INTEGER
    }
})

Payment.belongsTo(User, { foreignKey: 'attendee_CID' });
Payment.belongsTo(Event, { foreignKey: 'event_ID' });

// Sync database and handle potential issues with column existence
async function syncDb() {
    try {
        const tableDefinition = await db.getQueryInterface().describeTable('Payments');
        if (!tableDefinition.attendee_CID) {
            await db.sync({ alter: true });
        } else {
            console.log('Column "cid" already exists in "Payments" table. No alteration needed.');
        }
    } catch (error) {
        console.error('Error during sync:', error);
    }
}

syncDb();

module.exports = Payment