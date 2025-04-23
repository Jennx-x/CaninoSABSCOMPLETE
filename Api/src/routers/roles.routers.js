const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roles.controller');

// Crear rol
router.post('/', roleController.createRole);

// Obtener todos los roles
router.get('/', roleController.getAllRoles);

// Obtener rol por ID
router.get('/:id', roleController.getRoleById);

// Actualizar rol
router.put('/:id', roleController.updateRole);

// Eliminar rol
router.delete('/:id', roleController.deleteRole);

module.exports = router;
