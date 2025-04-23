import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const pastelBlue = '#d4e9f9';

  return (
    <>
      <div style={{ backgroundColor: pastelBlue }} className="text-dark text-center py-5">
        <Container>
          <h1 className="display-4 fw-bold mb-4">🐾 ¡Bienvenidos a Caninos SABS! 🐾</h1>
          <p className="lead">
            Soluciones integrales para el bienestar de tu fiel compañero. Desde Copacabana, con amor canino.
          </p>
          <p>
            Alimentación, juguetes, accesorios y servicios estéticos con cariño y profesionalismo.
          </p>
          <hr className="my-4" />
          <Link to="/productos">
            <Button variant="info" size="lg" className="fw-semibold shadow">
              <i className="bi bi-basket-fill me-2"></i> Ver Nuestros Productos
            </Button>
          </Link>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-4 text-center">
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-award-fill text-primary fs-1 mb-3"></i>
                <Card.Title className="fw-bold">Calidad Garantizada</Card.Title>
                <Card.Text className="text-muted">
                  Productos top y servicios profesionales para garantizar salud y bienestar a tu mascota.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-heart-pulse-fill text-danger fs-1 mb-3"></i>
                <Card.Title className="fw-bold">Amor Verdadero</Card.Title>
                <Card.Text className="text-muted">
                  Tratamos a tu peludo como parte de nuestra familia. Amor en cada detalle.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-shop-window text-success fs-1 mb-3"></i>
                <Card.Title className="fw-bold">Tienda Integral</Card.Title>
                <Card.Text className="text-muted">
                  Todo en un solo lugar: nutrición, diversión y cuidado estético para tu mejor amigo.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="text-center mt-5">
          <p className="fst-italic text-muted mb-3">
            En Caninos SABS, cuidamos a tu perro como tú lo harías. Conócenos mejor.
          </p>
          <Link to="/quienes-somos">
            <Button variant="outline-info" size="lg" className="shadow">
              <i className="bi bi-info-circle-fill me-2"></i> Conoce Nuestra Historia
            </Button>
          </Link>
        </div>
      </Container>
    </>
  );
};
