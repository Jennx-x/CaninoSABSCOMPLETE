const Category = require('../models/category.models');
const Product = require('../models/products.models');

// Crear un producto
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId, imageUrl   } = req.body;
        const newProduct = await Product.create({
            name,
            description,
            price,
            stock,
            categoryId,
            imageUrl  
        });

        res.status(201).json({
            status: 'success',
            message: 'Producto creado exitosamente',
            product: newProduct
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Error al crear el producto',
            error: err.message
        });
    }
};

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: {
                model: Category,
            }
        });

        res.status(200).json({
            status: 'success',
            products
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los productos',
            error: err.message
        });
    }
};


// Buscar un producto por su ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id, {
            include: {
                model: Category,
            }
        });

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            product
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener el producto',
            error: err.message
        });
    }
};



// Obtener productos de una categoría específica
exports.getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const products = await Product.findAll({
            where: { categoryId },
            include: {
                model: Category,
            }
        });

        if (!products.length) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encontraron productos para esta categoría'
            });
        }

        res.status(200).json({
            status: 'success',
            products
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los productos de la categoría',
            error: err.message
        });
    }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, categoryId, imageUrl } = req.body; 
    try {
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          status: "error",
          message: "Producto no encontrado",
        });
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.stock = stock || product.stock;
      product.categoryId = categoryId || product.categoryId;
      product.imageUrl = imageUrl || product.imageUrl; // Añadimos imageUrlpara poder que se actualice la url
      await product.save();

      res.status(200).json({
        status: "success",
        message: "Producto actualizado exitosamente",
        product,
      });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el producto',
            error: err.message
        });
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        await product.destroy();

        res.status(200).json({
            status: 'success',
            message: 'Producto eliminado exitosamente'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el producto',
            error: err.message
        });
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        await product.destroy();

        res.status(200).json({
            status: 'success',
            message: 'Producto eliminado exitosamente'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el producto',
            error: err.message
        });
    }
};
