import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { getRoles, postRoles, updateRole, deleteRole } from '../services/roles.service';

export const RolesAdmin = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentRole, setCurrentRole] = useState({ id: null, name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showEditConfirmationModal, setShowEditConfirmationModal] = useState(false);
  const [originalRoleData, setOriginalRoleData] = useState({});

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      setError(err.message || 'Error al cargar roles');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentRole({ id: null, name: '', description: '' });
    setValidationErrors({});
    setShowModal(true);
  };

  const openEditModal = (role) => {
    setModalMode('edit');
    setCurrentRole({ ...role });
    setOriginalRoleData({ ...role });
    setValidationErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRole(prevRole => ({ ...prevRole, [name]: value }));
  };

  const validateRole = (role, currentRoles, isEdit = false) => {
    const errors = {};
    if (!role.name.trim()) {
      errors.name = 'El nombre del rol es requerido';
    } else if (currentRoles.some(r => r.name.toLowerCase() === role.name.toLowerCase() && (isEdit ? r.id !== role.id : true))) {
      errors.name = 'Ya existe un rol con este nombre';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateRole(currentRole, roles);
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        if (modalMode === 'create') {
          await postRoles(currentRole);
          fetchRoles();
          closeModal();
        } else if (modalMode === 'edit') {
          setItemToEdit(currentRole);
          setShowEditConfirmationModal(true);
        }
      } catch (err) {
        setError(err.message || `Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} rol`);
      }
    }
  };

  const handleConfirmEdit = async () => {
    const errors = validateRole(itemToEdit, roles, true);
    setValidationErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        await updateRole(itemToEdit.id, itemToEdit);
        fetchRoles();
        closeModal();
        setShowEditConfirmationModal(false);
        setItemToEdit(null);
        setOriginalRoleData({});
      } catch (err) {
        setError(err.message || 'Error al actualizar rol');
      }
    }
  };

  const handleCancelEditConfirmation = () => {
    setShowEditConfirmationModal(false);
    setItemToEdit(null);
    setCurrentRole({ ...originalRoleData });
    setOriginalRoleData({});
  };

  const openDeleteConfirmationModal = (id) => {
    setItemToDelete(id);
    setShowConfirmationModal(true);
  };

  const handleCancelDeleteConfirmation = () => {
    setShowConfirmationModal(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRole(itemToDelete);
      fetchRoles();
      setShowConfirmationModal(false);
      setItemToDelete(null);
    } catch (err) {
      setError(err.message || 'Error al eliminar rol');
    }
  };

  if (loading) {
    return <Container className="mt-5">Cargando roles...</Container>;
  }

  if (error) {
    return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Gestión de Roles</h2>
      <Button variant="primary" className="mb-3" onClick={openCreateModal}>
        Crear Nuevo Rol
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Rol</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>{role.description}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button variant="info" size="sm" className="me-2" onClick={() => openEditModal(role)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => openDeleteConfirmationModal(role.id)}>Eliminar</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'create' ? 'Crear Nuevo Rol' : 'Editar Rol'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Rol</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentRole.name}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.name}
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={currentRole.description}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.description}
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              {modalMode === 'create' ? 'Crear' : 'Guardar Cambios'}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmationModal} onHide={handleCancelDeleteConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este rol?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDeleteConfirmation}>Cancelar</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Eliminar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditConfirmationModal} onHide={handleCancelEditConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cambios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas guardar los cambios realizados en este rol?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEditConfirmation}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirmEdit}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
