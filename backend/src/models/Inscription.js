const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Event = require('./Event');

const Inscription = sequelize.define('Inscription', {
  id: {
    type: DataTypes.CHAR(36),
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: Event,
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pendente', 'Confirmado', 'Cancelado'),
    defaultValue: 'Pendente',
  },
}, {
  timestamps: true,
});

Inscription.belongsTo(Event, { foreignKey: 'eventId' });
Event.hasMany(Inscription, { foreignKey: 'eventId' });

module.exports = Inscription;
