const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Role = require('./roles.models');
const Company = require('./company.models');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

// Relaciones
User.belongsTo(Role, { foreignKey: 'roleId' });
User.belongsTo(Company, { foreignKey: 'companyId' });

module.exports = User;
