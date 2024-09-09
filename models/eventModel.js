const { DataTypes } = require('sequelize');
const db = require('./db');
const User = require('./userModel');

const Event = db.define('Event', {
    eventid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // SQLite can handle this if UUID generation is enabled
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
    organizer_web: {
        type: DataTypes.STRING
    },
    event_regulations: {
        // SQLite does not have an ARRAY type, so we use a TEXT field with comma-separated values
        type: DataTypes.TEXT,
        get() {
            const rawValue = this.getDataValue('event_regulations');
            return rawValue ? rawValue.split(',') : [];
        },
        set(value) {
            this.setDataValue('event_regulations', value.join(','));
        }
    },
    pricing_Details: {
        type: DataTypes.STRING
    },
    media_Links: {
        // Same as above for storing array-like values as text
        type: DataTypes.TEXT,
        defaultValue: 'images/banners/custom-img.jpg'
    }
});

// Correct `belongsTo` association with proper foreign key syntax
Event.belongsTo(User, { foreignKey: 'eventmanagerCID', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Sync database and handle potential issues with column existence
async function syncDb() {
    try {
        const tableDefinition = await db.getQueryInterface().describeTable('Events');
        if (!tableDefinition.eventmanagerCID) {
            // await db.query('PRAGMA foreign_keys = OFF;');
            await db.sync({ alter: true });
            // await db.query('PRAGMA foreign_keys = ON;');
        } else {
            console.log('Column "eventmanagerCID" already exists in "Events" table. No alteration needed.');
        }
    } catch (error) {
        console.error('Error during sync:', error);
    }
}

syncDb();

module.exports = Event;