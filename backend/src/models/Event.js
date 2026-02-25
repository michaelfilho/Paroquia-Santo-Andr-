const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING(50)
  },
  location: {
    type: DataTypes.STRING(255)
  },
  description: {
    type: DataTypes.TEXT
  },
  dateEnd: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_end'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  isProgram: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_program'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  isInscriptionEvent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_inscription_event'
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'max_participants'
  },
  acceptsRegistration: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'accepts_registration'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_published'
  },
  published: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('isPublished');
    },
    set(value) {
      this.setDataValue('isPublished', value);
    }
  }
}, {
  tableName: 'events',
  timestamps: true
});

module.exports = Event;
