const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const db  = require('./db');

const User = db.define('User', {
  cid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phonenumber:{
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  address:{
    type: DataTypes.STRING,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    defaultValue: 'default.jpg',
  },
  role: {
    type: DataTypes.ENUM('user', 'eventmanager', 'admin'),
    defaultValue: 'user',
  },
  otp: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('active','suspended','banned'),
    defaultValue: 'active'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 255],
    },
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 12);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
  },
  tableName: 'Users' // Define table name explicitly to avoid case sensitivity issues
});

User.prototype.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}

// Sync database only if the 'Users' table doesn't exist
async function syncDb() {
  try {
    const tableExists = await db.getQueryInterface().showAllTables();
    
    // Only sync if the 'Users' table does not exist
    if (!tableExists.includes('Users')) {
      await db.sync({ alter: true });
      console.log('User table created and synchronized');
    } else {
      console.log('User table already exists. No sync needed.');
    }
  } catch (error) {
    console.error('Error during database synchronization:', error);
  }
}

syncDb();

module.exports = User;