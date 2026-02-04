const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Event = require('./Event');

const Inscription = sequelize.define('Inscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventId: {
    type: DataTypes.UUID,
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
    allowNull: false,
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
