const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/category.controller');

// Ruta para crear una categoría
router.post('/', createCategory);

// Ruta para obtener todas las categorías
router.get('/', getAllCategories);

// Ruta para obtener una categoría por su ID
router.get('/:id', getCategoryById);

// Ruta para actualizar una categoría
router.put('/:id', updateCategory);

// Ruta para eliminar una categoría
router.delete('/:id', deleteCategory);

module.exports = router;
