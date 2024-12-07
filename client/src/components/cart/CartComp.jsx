import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeItem,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from "../../redux/cart/cartSlice";

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const deliveryPrice = 5.99; // Fixed delivery price
  const [address, setAddress] = useState({
    userEmail: "",
    phone: "",
    streetAddress: "",
    city: "",
    country: "",
    postalCode: "",
  });

  useEffect(() => {
    if (window.location.href.includes("canceled=1")) {
      console.log("Payment failed 😔");
      // Display an error message or take other actions here
    }
  }, []);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subtotal + deliveryPrice;

  const handleAddressChange = (ev) => {
    const { id, value } = ev.target;
    setAddress((prevAddress) => ({ ...prevAddress, [id]: value }));
  };

  const proceedToCheckout = async (ev) => {
    ev.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/create`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, cartProducts: items }),
      }
    );

    if (response.ok) {
      console.log("Checkout successful");
      const { url } = await response.json();
      window.location = url; // Redirect to the success URL from the backend
    } else {
      console.log("Checkout failed");
      // Handle error (e.g., display an error message)
    }
  };

  if (items.length === 0) {
    return (
      <section className="mt-8 text-center">
        <h2 className="text-primary font-bold text-4xl italic">السلة</h2>
        <p className="mt-4">سلة التسوق الخاصة بك فارغة 😔</p>
      </section>
    );
  }

  return (
    <section className="mt-20 px-10 md:mt-10">
      <div className="overflow-x-auto mx-auto px-4 w-full">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-md rounded">
          <thead>
            <tr>
              <th className="whitespace-nowrap px-4 py-2 text-gray-900 text-start font-bold">
                اسم المنتج
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-gray-900 text-start font-bold">
                سعر المنتج
              </th>
              <th className="px-4 py-2 whitespace-nowrap text-gray-900 text-start font-bold">
                كمية المنتج
              </th>
              <th className="px-4 py-2 whitespace-nowrap text-gray-900 text-start font-bold">
                إجمالي المنتج
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((productInfo) => (
              <tr className="border-b" key={productInfo._id}>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 flex items-center gap-2">
                  <img
                    className="h-16 w-16 rounded-full object-cover object-center bg-gray-200"
                    src={productInfo.images?.[0] || "placeholder-image.jpg"}
                    alt={productInfo.title}
                  />
                  <div>
                    <h4>{productInfo.title}</h4>
                    <button
                      className="hover:text-red-600 underline"
                      onClick={() => dispatch(removeItem(productInfo._id))}
                    >
                      إزالة
                    </button>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <span>السعر: ${productInfo.price.toFixed(2)}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <div className="border-2 rounded-md flex items-center w-fit py-2 px-4 gap-8 text-lg">
                    <button
                      onClick={() =>
                        dispatch(decrementQuantity(productInfo._id))
                      }
                      className="border border-emerald-500 px-2 rounded-lg text-emerald-500"
                    >
                      -
                    </button>
                    <span className="px-2">الكمية: {productInfo.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(incrementQuantity(productInfo._id))
                      }
                      className="bg-emerald-500 px-2 rounded-lg text-white"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  المجموع: $
                  {(productInfo.price * productInfo.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="border py-2 px-4 my-5"
          onClick={() => dispatch(clearCart())}
        >
          مسح السلة
        </button>
      </div>
      <form onSubmit={proceedToCheckout}>
        <div className="mt-8 flex flex-col">
          {["userEmail", "phone", "streetAddress", "city", "country", "postalCode"].map(
            (field) => (
              <input
                key={field}
                id={field}
                value={address[field]}
                onChange={handleAddressChange}
                className="p-2 border-3 border-lightgray bg-slate-100 outline-none w-full rounded mb-2"
                type={
                  field === "postalCode" || field === "phone"
                    ? "number"
                    : "text"
                }
                placeholder={`أدخل ${field.replace(/([A-Z])/g, " $1")}`}
              />
            )
          )}
        </div>
        <div className="mt-8">
          <div className="flex my-3">
            <h3 className="grow font-bold text-gray-400">المجموع الفرعي:</h3>
            <h3 className="font-bold">${subtotal.toFixed(2)}</h3>
          </div>
          <div className="flex my-3">
            <h3 className="grow font-bold text-gray-400">التوصيل:</h3>
            <h3 className="font-bold">${deliveryPrice.toFixed(2)}</h3>
          </div>
          <div className="flex my-3 border-t pt-3 border-dashed border-emerald-500">
            <h3 className="grow font-bold text-gray-400">الإجمالي:</h3>
            <h3 className="font-bold">${total.toFixed(2)}</h3>
          </div>
        </div>
        <button
          type="submit"
          className="bg-emerald-500 px-5 py-2 rounded-xl font-bold text-white w-full my-4 shadow-emerald-300 shadow-lg"
        >
          الدفع ${total.toFixed(2)}
        </button>
      </form>
    </section>
  );
};

export default Cart;
