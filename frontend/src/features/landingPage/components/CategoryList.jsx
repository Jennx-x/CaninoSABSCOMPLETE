import React, { useEffect, useState } from 'react';
import { getCategories } from '../../admin/services/categories.service';
import { Row, Col, Card } from 'react-bootstrap';

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      })
      .catch(() => {
        
      });
  }, []);

  if (!Array.isArray(categories)) {
    return <p className="text-danger text-center">Ocurrió un error al mostrar las categorías.</p>;
  }

  if (categories.length === 0) {
    return <p className="text-muted text-center">No hay categorías disponibles.</p>;
  }

  return (
    <div className="py-5">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {categories.map((categoria) => (
          <Col key={categoria.id}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="text-primary">{categoria.name}</Card.Title>
                <Card.Text>{categoria.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
