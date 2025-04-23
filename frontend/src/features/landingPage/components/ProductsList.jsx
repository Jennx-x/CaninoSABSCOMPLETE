import React, { useState, useEffect } from 'react';
import { getProducts } from '../../admin/services/product.service';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';

export const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts();
        setProducts(data?.products || data || []);
      } catch (err) {
        setError('Error al cargar los productos.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return <div className="text-center py-5">Cargando...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center py-3">{error}</div>;
  }

  if (!products || products.length === 0) {
    return <div className="alert alert-info text-center py-3">No hay productos.</div>;
  }

  return (
    <div className="py-5">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products.map(product => (
          <Col key={product.id}>
            <Card className="shadow-sm h-100">
              <Card.Img
                variant="top"
                src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-primary">{product.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">${product.price}</Card.Subtitle>
                <Card.Text className="mb-auto text-secondary">
                  {product.description?.substring(0, 150)}...
                </Card.Text>
                <Button
                  variant="outline-primary"
                  onClick={() => handleShowModal(product)}
                  className="mt-3"
                >
                  Ver más
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        {selectedProduct && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProduct.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <img
                    src={selectedProduct.imageUrl || 'https://via.placeholder.com/500x300?text=Sin+Imagen'}
                    alt={selectedProduct.name}
                    className="img-fluid rounded mb-3"
                  />
                </Col>
                <Col md={6}>
                  <h4 className="text-primary">Detalles del Producto</h4>
                  <p className="text-muted">Precio: ${selectedProduct.price}</p>
                  <p className="text-secondary">{selectedProduct.description}</p>

                  {selectedProduct.category && (
                    <p className="text-muted">Categoría: {selectedProduct.category.name}</p>
                  )}
                  {selectedProduct.stock && (
                    <p className="text-muted">Stock disponible: {selectedProduct.stock}</p>
                  )}
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};
