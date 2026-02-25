const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const PrayerRequest = sequelize.define('PrayerRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  intention: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'prayer_requests',
  timestamps: true,
});

module.exports = PrayerRequest;
