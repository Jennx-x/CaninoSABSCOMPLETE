const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./category.models');

const Product = sequelize.define('products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true  // Permite que el campo esté vacío si no se proporciona una imagen
  },
}, {
  timestamps: true
});

// Relación con Categoría
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;
