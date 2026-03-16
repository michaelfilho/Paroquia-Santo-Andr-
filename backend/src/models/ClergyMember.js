const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ClergyMember = sequelize.define('ClergyMember', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('Pároco', 'Pároco Fundador', 'Vigário Paroquial', 'Papa', 'Bispo', 'Administrador', 'Frei'),
    allowNull: false
  },
  startYear: {
    type: DataTypes.STRING(10),
    field: 'start_year'
  },
  bio: {
    type: DataTypes.TEXT
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    field: 'image_url'
  },
  isCurrent: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_current'
  },
  current: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('isCurrent');
    },
    set(value) {
      this.setDataValue('isCurrent', value);
    }
  }
}, {
  tableName: 'clergy',
  timestamps: false
});

module.exports = ClergyMember;
