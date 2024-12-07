import Button from "../../Button";
import React, { useEffect, useState } from "react";

const Categories = () => {
  const [productsInfo, setProductsInfo] = useState([]);
  const [categories, setCategories] = useState([]);

  // Combined fetching logic for products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts`
        );
        const categoriesResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/category/getcategories`
        );

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProductsInfo(productsData.products);
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          // Ensure categoriesData is an array
          if (Array.isArray(categoriesData)) {
            setCategories(categoriesData);
          } else {
            console.error(
              "Expected categories to be an array but got:",
              categoriesData
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  console.log(categories);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-[90%] mx-auto">
      {Array.isArray(categories) && categories.length > 0 ? (
        categories.map((category) => {
          const hasProducts = productsInfo.some(
            (product) => product.category === category._id
          );

          return (
            hasProducts && (
              <div key={category._id}>
                <div className="col-span-2 py-10 pl-5 bg-gradient-to-br from-gray-400/90 to-gray-100 text-white rounded-3xl relative h-[320px] flex items-end">
                  <div className="mb-4">
                    <p className="mb-[2px] text-white">استمتع بـ</p>
                    <p className="text-2xl font-semibold mb-[2px]">مع</p>
                    <p className="text-4xl xl:text-5xl font-bold opacity-20 mb-2">
                      {category.name}
                    </p>
                    <Button
                      text="تصفح"
                      bgColor="bg-white"
                      textColor="text-primary"
                      category={category._id}
                    />
                  </div>
                  {productsInfo
                    .filter((product) => product.category === category._id)
                    .map((product) => (
                      <img
                        key={product._id} // Add unique key prop for each image
                        src={product.images[0]}
                        alt={category.name}
                        className="sm:w-[100px] lg:w-[120px] w-[150px] absolute top-1/2 -translate-y-1/2 right-5"
                      />
                    ))}
                </div>
              </div>
            )
          );
        })
      ) : (
        <p>لا توجد فئات متاحة.</p>
      )}
    </div>
  );
};

export default Categories;
