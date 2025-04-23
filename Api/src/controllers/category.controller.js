const Category = require('../models/category.models');

// Crear una categoría
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = await Category.create({ name, description });
    res.status(201).json({
      status: 'success',
      message: 'Categoría creada exitosamente',
      category: newCategory
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtener todas las categorías
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({
      status: 'success',
      categories
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtener una categoría por su ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Categoría no encontrada'
      });
    }
    res.status(200).json({
      status: 'success',
      category
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Actualizar una categoría
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Categoría no encontrada'
      });
    }
    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();
    res.status(200).json({
      status: 'success',
      message: 'Categoría actualizada exitosamente',
      category
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Categoría no encontrada'
      });
    }
    await category.destroy();
    res.status(200).json({
      status: 'success',
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
