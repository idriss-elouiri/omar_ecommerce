import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userProducts, setUserProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      if (currentUser.isAdmin) {
        try {
          const res = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/product/getproducts?userId=${currentUser._id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const data = await res.json();
          if (res.ok) {
            setUserProducts(data.products);
            setShowMore(data.products.length >= 9); // Show more button based on product count
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };
    fetchProducts();
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = userProducts.length;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts?userId=${
          currentUser._id
        }&startIndex=${startIndex}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUserProducts((prev) => [...prev, ...data.products]);
        setShowMore(data.products.length >= 9); // Update show more button based on new product count
      }
    } catch (error) {
      console.error("Error fetching more products:", error);
    }
  };

  const handleDeleteProduct = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/product/deleteproduct/${productIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        const data = await res.json();
        console.error("Error deleting product:", data.message);
      } else {
        setUserProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div
      className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"
      dir="rtl"
    >
      {currentUser.isAdmin ? (
        userProducts.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>تاريخ التحديث</Table.HeadCell>
                <Table.HeadCell>صورة المنتج</Table.HeadCell>
                <Table.HeadCell>عنوان المنتج</Table.HeadCell>
                <Table.HeadCell>الفئة</Table.HeadCell>
                <Table.HeadCell>حذف</Table.HeadCell>
                <Table.HeadCell>تعديل</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {userProducts.map((product) => (
                  <Table.Row
                    key={product._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/product-details/${product.slug}`}>
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-20 h-10 object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`/product-details/${product.slug}`}
                      >
                        {product.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{product.category}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setProductIdToDelete(product._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        حذف
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/update-product/${product._id}`}
                        className="text-teal-500 hover:underline"
                      >
                        تعديل
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {showMore && (
              <button
                onClick={handleShowMore}
                className="w-full text-teal-500 self-center text-sm py-7"
              >
                عرض المزيد
              </button>
            )}
          </>
        ) : (
          <p>ليس لديك أي منتجات حتى الآن!</p>
        )
      ) : (
        <p>ليس لديك صلاحية وصول كمسؤول!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              هل أنت متأكد أنك تريد حذف هذا المنتج؟
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteProduct}>
                نعم، أنا متأكد
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                لا، إلغاء
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
