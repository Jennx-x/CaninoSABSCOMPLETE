const Role = require("../models/roles.models");

// Crear rol
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.create({ name, description });
    res.status(201).json({
      message: "Rol creado correctamente",
      role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el rol", error: error.message });
  }
};

// Listar todos los roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los roles", error: error.message });
  }
};

// Obtener rol por ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: "Rol no encontrado" });
    res.status(200).json(role);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el rol", error: error.message });
  }
};

// Actualizar rol
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: "Rol no encontrado" });

    await role.update({ name, description });
    res.status(200).json({ message: "Rol actualizado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el rol", error: error.message });
  }
};

// Eliminar rol
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: "Rol no encontrado" });

    await role.destroy();
    res.status(200).json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el rol", error: error.message });
  }
};
