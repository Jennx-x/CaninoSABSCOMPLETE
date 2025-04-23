import React from 'react';
import { Container } from 'react-bootstrap';
import { ProductsList } from '../components/ProductsList';
export const ProductsPage = () => {
  return (
    <Container className="mt-5">
      <h1 className="display-4 fw-bold mb-4 text-success text-center">🐕 Explora Nuestra Selección Canina</h1>
      <ProductsList/>
    </Container>
  );
};

