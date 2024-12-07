import React, { useEffect, useState } from "react";
import Product from "./Product";
import Services from "./Services";
import Footer from "./Footer";
import Hero from "./Hero";
import Categories from "./category/Categories";

const HomeComp = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main>
      <Hero />
      <Services />
      <Categories />
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <Product products={products} textHeading="احدث المنتجات" />
      )}
      <Footer />
    </main>
  );
};

export default HomeComp;
