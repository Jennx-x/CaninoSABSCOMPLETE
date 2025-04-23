
const bcrypt = require('bcryptjs');
const Role = require('../models/roles.models');
const Company = require('../models/company.models');
const User = require('../models/users.models');

// Crear usuario
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password, roleId, companyId } = req.body;

    // Validar existencia de rol y compañía
    const role = await Role.findByPk(roleId);
    const company = await Company.findByPk(companyId);
    if (!role || !company) return res.status(400).json({ message: 'Rol o Compañía no válidos' });

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      roleId,
      companyId
    });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        roleId: newUser.roleId,
        companyId: newUser.companyId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [Role, Company]
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [Role, Company]
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, roleId, companyId } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    await user.update({ fullName, email, roleId, companyId });
    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};
