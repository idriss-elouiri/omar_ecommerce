import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const pageSize = 10; // Number of orders per page

export default function MyOrder() {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);
console.log(currentUser.email)
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/get?userEmail=${currentUser.email}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setOrders(data.reverse()); // Reverse orders for recent first
      } else {
        console.error("Failed to fetch orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(orders.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(currentPage * pageSize, orders.length);
  const ordersToDisplay = orders.slice(startIndex, endIndex);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col w-full" dir="rtl">
      <header>
        <div className="my-10 text-center w-full">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-3xl">
            جميع الطلبات
          </h1>
        </div>
        <hr className="my-8 h-px border-0 bg-gray-300" />
      </header>
      <div className="overflow-x-auto mx-auto px-4 w-full">
        {loadingOrders ? (
          <div>جاري تحميل الطلبات...</div>
        ) : orders.length === 0 ? (
          <p className="w-full text-center text-xl font-semibold">
            لا توجد طلبات متاحة.
          </p>
        ) : (
          <>
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-md border rounded">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 text-gray-900 text-start font-bold">
                    مدفوع
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-gray-900 text-start font-bold">
                    اسم المستخدم
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-gray-900 text-start font-bold">
                    تاريخ الإنشاء
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-gray-900 text-start font-bold">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ordersToDisplay.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div
                        className={`p-2 rounded-md text-white w-24 text-center ${
                          order.paid ? "bg-emerald-500" : "bg-red-400"
                        }`}
                      >
                        {order.paid ? "مدفوع" : "غير مدفوع"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span>{order.userEmail}</span>
                        <span className="text-gray-500 text-xs">
                          {order.cartProducts.map((p) => p.title).join(", ")}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="justify-end flex gap-2 items-center whitespace-nowrap">
                      <Link to={`/order/${order._id}`} className="button">
                        عرض الطلب
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => changePage(i + 1)}
                    className={`mx-2 px-3 py-2 rounded ${
                      i + 1 === currentPage
                        ? "bg-blue-300 text-slate-900"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
