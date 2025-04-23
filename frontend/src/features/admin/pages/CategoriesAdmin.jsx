import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import {
  getCategories,
  postCategories,
  updateCategory,
  deleteCategory,
} from '../services/categories.service';

const styles = {
  longTextCell: {
    maxWidth: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

export const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentCategory, setCurrentCategory] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategories();
      
      if (Array.isArray(response)) {
        setCategories(response);
      } else if (response && Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response && Array.isArray(response.categories)) {
        setCategories(response.categories);
      } else {
        setError('Error: Los datos de categorías recibidos no son un array en el formato esperado.');
        setCategories([]);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormError('');
    setCurrentCategory({
      name: '',
      description: '',
    });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setFormError('');
    setCurrentCategory({
      id: category.id,
      name: category.name,
      description: category.description,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDeleteConfirmation(false);
    setShowEditConfirmation(false);
    setCategoryToDeleteId(null);
    setCategoryToEdit(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validaciones
    const { name, description } = currentCategory;

    if (!name.trim()) {
      setFormError('El nombre de la categoría es obligatorio.');
      return;
    }

    if (!description.trim()) {
      setFormError('La descripción de la categoría es obligatoria.');
      return;
    }

    if (name.trim().length < 3) {
      setFormError('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    // Validar nombres duplicados
    let nombreRepetido = false;
    if (modalMode === 'create') {
      nombreRepetido = categories.some(
        (cat) => cat.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
    } else {
      nombreRepetido = categories.some(
        (cat) =>
          cat.name.toLowerCase().trim() === name.toLowerCase().trim() &&
          cat.id !== currentCategory.id
      );
    }

    if (nombreRepetido) {
      setFormError('Ya existe una categoría con ese nombre.');
      return;
    }

    if (modalMode === 'edit') {
      setCategoryToEdit(currentCategory);
      setShowEditConfirmation(true);
    } else {
      try {
        await postCategories(currentCategory);
        fetchCategories();
        closeModal();
      } catch (err) {
        setError(err.message || 'Error al crear categoría');
      }
    }
  };

  const handleConfirmEdit = async () => {
    try {
      await updateCategory(categoryToEdit.id, categoryToEdit);
      fetchCategories();
      closeModal();
    } catch (err) {
      setError(err.message || 'Error al actualizar categoría');
    }
  };

  const handleDeleteCategory = (id) => {
    setCategoryToDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory(categoryToDeleteId);
      fetchCategories();
      closeModal();
    } catch (err) {
      setError(err.message || 'Error al eliminar categoría');
    }
  };

  if (loading) {
    return <Container className="mt-4">Cargando categorías...</Container>;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col xs="auto">
          <h2 className="mb-0">Gestión de Categorías</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={openCreateModal}>
            Crear Nueva Categoría
          </Button>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped bordered hover className="table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th style={{ minWidth: '180px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td style={styles.longTextCell}>{category.description}</td>
                <td className="d-flex gap-2">
                  <Button
                    variant="info"
                    size="sm"
                    className="mb-1 mb-md-0"
                    style={{ padding: '0.25rem 0.5rem' }}
                    onClick={() => openEditModal(category)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="mb-1 mb-md-0"
                    style={{ padding: '0.25rem 0.5rem' }}
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' ? 'Crear Nueva Categoría' : 'Editar Categoría'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentCategory.name}
                onChange={handleInputChange}
                required
                minLength={3}
              />
              <Form.Text className="text-muted">
                Mínimo 3 caracteres. El nombre debe ser único.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={currentCategory.description}
                onChange={handleInputChange}
                required
              />
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

      <Modal show={showDeleteConfirmation} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditConfirmation} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Edición</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas guardar los cambios en esta categoría?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmEdit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};