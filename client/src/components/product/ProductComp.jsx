import React, { useEffect, useState } from "react";
import ProductBox from "../Home/ProductBox";

const ProductComp = () => {
  const [productsInfo, setProductsInfo] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProductsInfo(data.products);
      } catch (error) {
        setError(error.message);
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/category/getcategories`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setCategories(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProducts();
    fetchCategories();
  }, []);

  const renderProductsByCategory = (category) => {
    // Check if productsInfo is an array before filtering
    const filteredProducts = Array.isArray(productsInfo)
      ? productsInfo.filter((product) => product.category === category._id)
      : [];

    if (filteredProducts.length === 0) return null;

    return (
      <div key={category._id}>
        <h2 className="text-2xl py-5 capitalize">{category.name}</h2>
        <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
          {filteredProducts.map((product) => (
            <div key={product._id} className="px-5 snap-start">
              <ProductBox productInfo={product} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="px-10 mt-20 md:mt-10">
      {error && <div className="text-red-500">{error}</div>}
      {categories.map(renderProductsByCategory)}
    </section>
  );
};

export default ProductComp;
