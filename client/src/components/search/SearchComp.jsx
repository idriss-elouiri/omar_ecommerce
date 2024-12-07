import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductBox from "../Home/ProductBox";
import Footer from "../Home/Footer";

const FilterForm = ({
  sidebarData,
  handleChange,
  categories,
  handleSubmit,
}) => (
  <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
    <div className="flex items-center gap-2">
      <label className="whitespace-nowrap font-semibold">Search Term:</label>
      <TextInput
        placeholder="Search..."
        id="searchTerm"
        type="text"
        value={sidebarData.searchTerm}
        onChange={handleChange}
      />
    </div>
    <div className="flex items-center gap-2">
      <label className="font-semibold">Sort:</label>
      <Select onChange={handleChange} value={sidebarData.sort} id="sort">
        <option value="desc">Latest</option>
        <option value="asc">Oldest</option>
      </Select>
    </div>
    <div className="flex items-center gap-2">
      <label className="font-semibold">Category:</label>
      <Select
        id="category"
        value={sidebarData.category}
        onChange={handleChange}
      >
        <option value="0">No category selected</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </Select>
    </div>
    <Button type="submit" outline gradientDuoTone="purpleToPink">
      Apply Filters
    </Button>
  </form>
);

export default function SearchComp() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchProducts = async (searchQuery) => {
    setLoading(true);
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/product/getproducts?${searchQuery}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
      setShowMore(data.products.length === 9);
    } else {
      setProducts([]);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/category/getcategories`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.toString();
    fetchProducts(searchQuery);

    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "",
      });
    }
  }, [location.search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prevData) => ({
      ...prevData,
      [id]: value || (id === "category" ? "uncategorized" : ""),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sidebarData);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = products.length;
    const urlParams = new URLSearchParams({ ...sidebarData, startIndex });
    fetchProducts(urlParams.toString());
  };

  return (
    <>
      <>
        <div className="flex flex-col md:flex-row">
          <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
            <FilterForm
              sidebarData={sidebarData}
              handleChange={handleChange}
              categories={categories}
              handleSubmit={handleSubmit}
            />
          </div>
          <div className="w-full">
            <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
              نتائج المنتجات:
            </h1>
            <div className="p-7 flex flex-wrap gap-4">
              {loading && (
                <p className="text-xl text-gray-500">جاري التحميل...</p>
              )}
              {!loading && products.length === 0 && (
                <p className="text-xl text-gray-500">
                  لم يتم العثور على منتجات.
                </p>
              )}
              {!loading &&
                products.map((productInfo) => (
                  <ProductBox key={productInfo._id} productInfo={productInfo} />
                ))}
              {showMore && (
                <button
                  onClick={handleShowMore}
                  className="text-teal-500 text-lg hover:underline p-7 w-full"
                >
                  عرض المزيد
                </button>
              )}
            </div>
          </div>
        </div>
      </>
      <Footer />
    </>
  );
}
