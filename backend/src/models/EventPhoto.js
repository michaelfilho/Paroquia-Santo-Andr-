const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Event = require('./Event');

const EventPhoto = sequelize.define('EventPhoto', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  eventId: {
    type: DataTypes.CHAR(36),
    field: 'event_id',
    references: {
      model: Event,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    field: 'image_url'
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  path: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'event_photos',
  timestamps: true,
  underscored: true
});

module.exports = EventPhoto;
