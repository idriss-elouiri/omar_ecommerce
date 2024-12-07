import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrderComp = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/order/get?_id=${id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          if (!response.ok) throw new Error("Failed to fetch order");
          const data = await response.json();
          setOrder(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrder();
  }, [id]);

  const calculateSubtotal = () => {
    return (
      order?.cartProducts?.reduce(
        (total, product) => total + product.price,
        0
      ) || 0
    );
  };

  const subtotal = calculateSubtotal();

  if (loading) {
    return <div className="text-center">جاري تحميل الطلب...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <section className="max-w-2xl mx-auto mt-20 md:mt-10">
      <div className="text-center">
        <h2 className="text-primary font-bold text-4xl italic">الطلبات</h2>
        <div className="mt-4 mb-8">
          <p>شكراً لطلبك.</p>
          <p>سوف نتصل بك عندما يكون طلبك في الطريق.</p>
        </div>
      </div>
      {order && (
        <>
          {order.cartProducts.map((product) => (
            <div className="flex mb-5 items-center" key={product._id}>
              <div></div>
              <div
                className="bg-gray-100 p-3 rounded-xl shrink-0"
                style={{ boxShadow: "inset 1px 0px 10px 10px rgba(0,0,0,0.1)" }}
              >
                <img
                  className="w-24"
                  src={product.images[0]}
                  alt={product.title}
                />
              </div>
              <div className="pl-4">
                <h3 className="font-bold text-lg">{product.title}</h3>
                <p className="text-sm leading-4 text-gray-500 line-clamp-3">
                  {product.briefDesc}
                </p>
                <div className="flex mt-1">
                  <div className="grow font-bold">${product.price}</div>
                  <div>
                    <button className="border border-emerald-500 px-2 rounded-lg text-emerald-500">
                      -
                    </button>
                    <span className="px-2">0</span>
                    <button className="bg-emerald-500 px-2 rounded-lg text-white">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <form>
            <div className="mt-8 flex flex-col">
              <div className="mt-8">
                {[
                  "phone",
                  "streetAddress",
                  "city",
                  "country",
                  "postalCode",
                ].map((field) => (
                  <input
                    key={field}
                    name={field}
                    id={field}
                    value={order[field]}
                    disabled
                    className="p-2 border-[3px] border-[lightgray] bg-slate-100 outline-none w-full rounded mb-2"
                    type={
                      field === "postalCode" || field === "phone"
                        ? "number"
                        : "text"
                    }
                    placeholder={
                      field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")
                    }
                  />
                ))}
              </div>
            </div>
            <div className="mt-8">
              <div className="flex my-3">
                <h3 className="grow font-bold text-gray-400">
                  المجموع الفرعي:
                </h3>
                <h3 className="font-bold">${subtotal}</h3>
              </div>
              <div className="flex my-3">
                <h3 className="grow font-bold text-gray-400">التوصيل:</h3>
                <h3 className="font-bold">$5</h3>
              </div>
              <div className="flex my-3 border-t pt-3 border-dashed border-emerald-500">
                <h3 className="grow font-bold text-gray-400">الإجمالي:</h3>
                <h3 className="font-bold">${subtotal + 5}</h3>
              </div>
            </div>
            <input type="hidden" name="products" />
          </form>
        </>
      )}
    </section>
  );
};

export default OrderComp;
