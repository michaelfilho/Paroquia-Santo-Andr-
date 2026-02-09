const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const bcrypt = require('bcryptjs');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'admin',
  },
}, {
  hooks: {
    beforeSave: async (admin) => {
      if (admin.changed('password')) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    },
  },
  timestamps: false, // Remover createdAt e updatedAt
});

Admin.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = Admin;
