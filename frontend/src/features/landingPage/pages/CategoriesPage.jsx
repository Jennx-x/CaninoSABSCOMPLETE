import React from 'react';
import { CategoryList } from '../components/CategoryList';

export const CategoriesPage = () => {
  return (
    <section className="py-5 bg-light" id="categorias">
      <div className="container">
      <h1 className="display-4 fw-bold mb-4 text-success text-center">🐕 Nuestras Categorías</h1>
        <CategoryList />
      </div>
    </section>
  );
};



