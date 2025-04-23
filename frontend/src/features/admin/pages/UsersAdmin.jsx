import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { getUsers, postUsers, updateUser, deleteUser } from '../services/users.service';
import { getRoles } from '../services/roles.service';
import { getCompanies } from '../services/companies.service';

export const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentUser, setCurrentUser] = useState({ id: null, fullName: '', email: '', password: '', roleId: '', companyId: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showEditConfirmationModal, setShowEditConfirmationModal] = useState(false);
  const [originalUserData, setOriginalUserData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersData = await getUsers();
      const rolesData = await getRoles();
      const companiesData = await getCompanies();
      setUsers(usersData);
      setRoles(rolesData);
      setCompanies(companiesData);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios, roles o compañías');
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Desconocido';
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Desconocida';
  };

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentUser({ id: null, fullName: '', email: '', password: '', roleId: '', companyId: '' });
    setValidationErrors({});
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setCurrentUser({ ...user });
    setOriginalUserData({ ...user });
    setValidationErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const validateUser = (user, users, isEdit = false) => {
    const errors = {};
    if (!user.fullName.trim()) {
      errors.fullName = 'El nombre completo es requerido';
    } else if (!/^[a-zA-Z\s]*$/.test(user.fullName)) {
      errors.fullName = 'El nombre completo solo puede contener letras y espacios';
    }

    if (!user.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = 'El email no tiene un formato válido';
    } else if (users.some(u => u.email === user.email && (isEdit ? u.id !== user.id : true))) {
      errors.email = 'Este email ya está registrado';
    }

    if (modalMode === 'create' && !user.password.trim()) {
      errors.password = 'La contraseña es requerida';
    } else if (modalMode === 'create' && user.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!user.roleId) {
      errors.roleId = 'El rol es requerido';
    }

    if (!user.companyId) {
      errors.companyId = 'La compañía es requerida';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateUser(currentUser, users, modalMode === 'edit');
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (modalMode === 'create') {
        try {
          await postUsers(currentUser);
          fetchData();
          closeModal();
        } catch (err) {
          setError(err.message || 'Error al crear usuario');
        }
      } else if (modalMode === 'edit') {
        setItemToEdit(currentUser);
        setShowEditConfirmationModal(true);
      }
    }
  };

  const handleConfirmEdit = async () => {
    try {
      await updateUser(itemToEdit.id, itemToEdit);
      fetchData();
      closeModal();
      setShowEditConfirmationModal(false);
      setItemToEdit(null);
      setOriginalUserData({});
    } catch (err) {
      setError(err.message || 'Error al actualizar usuario');
    }
  };

  const handleCancelEditConfirmation = () => {
    setShowEditConfirmationModal(false);
    setItemToEdit(null);
    setCurrentUser({ ...originalUserData });
    setOriginalUserData({});
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
      await deleteUser(itemToDelete);
      fetchData();
      setShowConfirmationModal(false);
      setItemToDelete(null);
    } catch (err) {
      setError(err.message || 'Error al eliminar usuario');
    }
  };

  if (loading) {
    return <Container className="mt-5">Cargando...</Container>;
  }

  if (error) {
    return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Gestión de Usuarios</h2>
      <Button variant="primary" className="mb-3" onClick={openCreateModal}>
        Crear Nuevo Usuario
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Compañía</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{getRoleName(user.roleId)}</td>
              <td>{getCompanyName(user.companyId)}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button variant="info" size="sm" onClick={() => openEditModal(user)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => openDeleteConfirmationModal(user.id)}>Eliminar</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={currentUser.fullName}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.fullName}
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.fullName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentUser.email}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            {modalMode === 'create' && (
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={currentUser.password}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.password}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.password}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                name="roleId"
                value={currentUser.roleId}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.roleId}
                required
              >
                <option value="">Seleccionar Rol</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {validationErrors.roleId}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Compañía</Form.Label>
              <Form.Control
                as="select"
                name="companyId"
                value={currentUser.companyId}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.companyId}
                required
              >
                <option value="">Seleccionar Compañía</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {validationErrors.companyId}
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
          ¿Estás seguro de que deseas eliminar este usuario?
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
          ¿Estás seguro de que deseas guardar los cambios realizados en este usuario?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEditConfirmation}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirmEdit}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};