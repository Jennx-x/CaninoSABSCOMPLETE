const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductsByCategory, updateProduct, deleteProduct,getProductById } = require('../controllers/products.controller');

// Crear un producto
router.post('/', createProduct);

// Obtener todos los productos
router.get('/', getAllProducts);

// Obtener un producto por ID
router.get('/:id', getProductById); 

// Obtener productos por categoría
router.get('/category/:categoryId', getProductsByCategory);

// Actualizar un producto
router.put('/:id', updateProduct);

// Eliminar un producto
router.delete('/:id', deleteProduct);

module.exports = router;
