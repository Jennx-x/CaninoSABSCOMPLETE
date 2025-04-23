const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Company = sequelize.define('companies', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    nit: { type: DataTypes.STRING, allowNull: false, unique: true },
    address: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, validate: { isEmail: true } }
});

module.exports = Company;
