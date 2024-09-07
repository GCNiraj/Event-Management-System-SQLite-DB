const { DataTypes } = require('sequelize');
const db = require('./db');
const User = require('./userModel');
const Event = require('./eventModel');

const Payment = db.define('Payment', {
    transaction_ID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1, // SQLite supports UUIDs as strings
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
    total_Amount: {
        type: DataTypes.INTEGER
    },
    no_of_tickets: {
        type: DataTypes.INTEGER
    },
    pay_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'Payments' // Define table name explicitly to avoid case sensitivity issues
});

// Define relationships with cascading on update/delete
Payment.belongsTo(User, { foreignKey: 'attendee_CID', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Payment.belongsTo(Event, { foreignKey: 'event_ID', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Sync the database
async function syncDb() {
    try {
        // Directly sync the database without manual column checking
        // await db.sync({ alter: true });
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Error during sync:', error);
    }
}

syncDb();

module.exports = Payment;