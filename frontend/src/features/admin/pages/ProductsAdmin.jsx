import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Alert, Row, Col } from "react-bootstrap";
import {
  getProducts,
  postProducts,
  updateProduct,
  deleteProduct,
} from "../services/product.service";
import { getCategories } from "../services/categories.service";

const styles = {
  longTextCell: {
    maxWidth: "150px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  imageUrlCell: {
    maxWidth: "100px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

export const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); 
  const [productToDeleteId, setProductToDeleteId] = useState(null); 
  const [showEditConfirmation, setShowEditConfirmation] = useState(false); 
  const [productToEdit, setProductToEdit] = useState(null); 
  useEffect(() => {
    fetchProducts();
    fetchCategoriesData();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts();
      if (Array.isArray(response)) {
        setProducts(response);
      } else if (response && Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response && Array.isArray(response.products)) {
        setProducts(response.products);
      } else {
        setError(
          "Error: Los datos de productos recibidos no son un array en el formato esperado."
        );
        setProducts([]);
      }
    } catch (err) {
      setError(err.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesData = async () => {
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const response = await getCategories();
      if (Array.isArray(response)) {
        setCategories(response);
      } else if (response && Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response && Array.isArray(response.categories)) {
        setCategories(response.categories);
      } else {
        setErrorCategories(
          "Error: Los datos de categorías recibidos no son un array en el formato esperado."
        );
        setCategories([]);
      }
    } catch (err) {
      setErrorCategories(err.message || "Error al cargar categorías");
    } finally {
      setLoadingCategories(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormError(""); 
    setCurrentProduct({
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      imageUrl: "",
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setModalMode("edit");
    setCurrentProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || "",
    });
    setShowModal(true);
  };
  const openViewModal = (product) => {
    const updatedProduct = products.find((p) => p.id === product.id);
    setViewingProduct(product);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDeleteConfirmation(false); 
    setShowEditConfirmation(false); 
    setProductToDeleteId(null);
    setProductToEdit(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(""); 

    
    const { name, price, stock, categoryId, description, imageUrl } =
      currentProduct;

    if (
      !name.trim() ||
      !price ||
      !stock ||
      !categoryId ||
      !description.trim() ||
      !imageUrl
    ) {
      setFormError("Por favor completa todos los campos obligatorios.");
      return; 
    }

    if (parseFloat(price) < 0 || parseInt(stock) < 0) {
      setFormError("El precio y el stock deben ser valores positivos.");
      return; 
    }

  
    let nombreRepetido = false;
    if (modalMode === "create") {
      
      nombreRepetido = products.some(
        (prod) => prod.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
    }

    if (modalMode === "edit") {
      
      nombreRepetido = products.some(
        (prod) =>
          prod.name.toLowerCase().trim() === name.toLowerCase().trim() &&
          prod.id !== currentProduct.id
      );
    }

    if (nombreRepetido) {
      setFormError("Ya existe un producto con ese nombre.");
      return; 
    }
    if (modalMode === "edit") {
      setProductToEdit(currentProduct); 
      setShowEditConfirmation(true); 
    } else {
      try {
        if (modalMode === "create") {
          await postProducts(currentProduct); 
        } else {
          await updateProduct(currentProduct.id, currentProduct); 
        }
        fetchProducts(); 
        closeModal(); 
      } catch (err) {
        setError(err.message || "Error al guardar el producto");
      }
    }
  };

  const handleConfirmEdit = async () => {
    try {
      await updateProduct(productToEdit.id, productToEdit);
      fetchProducts();
      closeModal();
    } catch (err) {
      setError(err.message || "Error al actualizar producto");
    }
  };

  const handleDeleteProduct = (id) => {
    setProductToDeleteId(id); 
    setShowDeleteConfirmation(true); 
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(productToDeleteId);
      fetchProducts();
      closeModal();
    } catch (err) {
      setError(err.message || "Error al eliminar producto");
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Sin Categoría";
  };

  if (loading || loadingCategories) {
    return <Container className="mt-4">Cargando productos...</Container>;
  }

  if (error || errorCategories) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error || errorCategories}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col xs="auto">
          <h2 className="mb-0">Gestión de Productos</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={openCreateModal}>
            Crear Nuevo Producto
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
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>URL Imagen</th>
              <th style={{ minWidth: "240px" }}>Acciones</th>{" "}
              
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td style={styles.longTextCell}>{product.name}</td>
                <td style={styles.longTextCell}>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{getCategoryName(product.categoryId)}</td>
                <td style={styles.imageUrlCell}>{product.imageUrl}</td>
                <td className="d-flex gap-2">
                  <Button
                    variant="info"
                    size="sm"
                    className="mb-1 mb-md-0"
                    style={{ padding: "0.25rem 0.5rem" }}
                    onClick={() => openEditModal(product)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="mb-1 mb-md-0"
                    style={{ padding: "0.25rem 0.5rem" }}
                    onClick={() => handleDeleteProduct(product.id)} 
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="mb-1 mb-md-0"
                    style={{ padding: "0.25rem 0.5rem" }}
                    onClick={() => openViewModal(product)}
                  >
                    Ver
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
            {modalMode === "create" ? "Crear Nuevo Producto" : "Editar Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={currentProduct.price}
                  onChange={handleInputChange}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={currentProduct.stock}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  as="select"
                  name="categoryId"
                  value={currentProduct.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar Categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="textarea"
                name="description"
                value={currentProduct.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL Imagen</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={currentProduct.imageUrl}
                onChange={handleInputChange}
                required
              />
              <Form.Text className="text-muted">
                Introduce la URL de la imagen del producto.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              {modalMode === "create" ? "Crear" : "Guardar Cambios"}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showViewModal} onHide={closeViewModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {viewingProduct && (
            <div>
              <p>
                <strong>ID:</strong> {viewingProduct.id}
              </p>
              <p>
                <strong>Nombre:</strong> {viewingProduct.name}
              </p>
              <p>
                <strong>Descripción:</strong> {viewingProduct.description}
              </p>
              <p>
                <strong>Precio:</strong> ${viewingProduct.price}
              </p>
              <p>
                <strong>Stock:</strong> {viewingProduct.stock}
              </p>
              <p>
                <strong>Categoría:</strong>{" "}
                {getCategoryName(viewingProduct.categoryId)}
              </p>
              <p>
                <strong>URL Imagen:</strong>
                <a
                  href={viewingProduct.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {viewingProduct.imageUrl}
                </a>
              </p>
              {viewingProduct.imageUrl && (
                <div className="mt-3">
                  <img
                    src={viewingProduct.imageUrl}
                    alt={viewingProduct.name}
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeViewModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showDeleteConfirmation} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este producto?
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
          ¿Estás seguro de que deseas guardar los cambios de este producto?
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

