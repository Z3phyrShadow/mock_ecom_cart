import React from "react";
import ProductList from "../components/ProductList";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4 h-full">
      <ProductList />
    </div>
  );
};

export default Home;
