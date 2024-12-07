import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../comment/CommentSection";
import DetailsProductComp from "../Home/DetailsProductComp";
import Product from "../Home/Product";
import Footer from "../Home/Footer";

const ProductDetailsComp = () => {
  const { productSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);

  const fetchData = async (url, setter) => {
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch data");

      // Check if products is an array and extract the first product
      if (
        data.products &&
        Array.isArray(data.products) &&
        data.products.length > 0
      ) {
        setter(data.products[0]); // Assuming you want the first product
      } else {
        setter(data); // Handle other cases or errors accordingly
      }
    } catch (error) {
      setError(error.message); // Set error message if an error occurs
    } finally {
      setLoading(false); // Ensure loading is set to false after fetch
    }
  };

  useEffect(() => {
    // Fetch the product details and recent products when productSlug changes
    fetchData(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/product/getproducts?slug=${productSlug}`,
      setProduct
    );
    fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts?limit=4`,
      setRecentProducts
    );
  }, [productSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }
  console.log(product);
  console.log(product.title);
  return (
    <>
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        {product ? ( // Check if product is available
          <DetailsProductComp product={product} />
        ) : (
          <p className="text-red-500">المنتج غير موجود</p> // Display message if product is not found
        )}
        <CommentSection productId={product?._id} />
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentProducts.length > 0 && (
            <Product
              products={recentProducts}
              textHeading={"Recent Articles"}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailsComp;
