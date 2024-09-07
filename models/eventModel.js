const { DataTypes } = require('sequelize')
const db = require('./db')
const User = require('./userModel');

const Event = db.define('Event',{
    eventid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    eventmanagerCID: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'cid'
        },
    },
    eventName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    available_seats: {
        type: DataTypes.INTEGER,
    },
    start_Date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_Date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    organizer: {
        type: DataTypes.STRING
    },
    organizer_email: {
        type: DataTypes.STRING
    },
    organizer_number: {
        type: DataTypes.STRING
    },
    organizer_web:{
        type: DataTypes.STRING
    },
    event_regulations: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    pricing_Details: {
        type: DataTypes.STRING
    },
    media_Links: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        default: ['']
    }
})

// Correct `belongsTo` association with proper foreign key syntax
Event.belongsTo(User, { foreignKey: 'eventmanagerCID' });

// Sync database and handle potential issues with column existence
async function syncDb() {
    try {
        const tableDefinition = await db.getQueryInterface().describeTable('Events');
        if (!tableDefinition.eventmanagerCID) {
            await db.sync({ alter: true });
        } else {
            console.log('Column "cid" already exists in "Events" table. No alteration needed.');
        }
    } catch (error) {
        console.error('Error during sync:', error);
    }
}

syncDb();

module.exports = Event;