import { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../../redux/cart/cartSlice";

const DetailsProductComp = ({ product }) => {
  const { _id, images, title, price, slug, content, briefDesc } = product || {};
  const [showMore, setShowMore] = useState({});
  const [activeImg, setActiveImage] = useState(images?.[0] || ""); // Fallback if images is empty
  const [amount, setAmount] = useState(1);
  const dispatch = useDispatch();

  // Ensure the product is not undefined or null
  if (!product) return null;

  const handleAddToCart = () => {
    // Adding product with amount to the cart
    dispatch(addItem({ ...product, quantity: amount }));
  };

  const toggleShowMore = (id) => {
    setShowMore((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <section className="container py-20 md:py-5">
      <div className="flex flex-col justify-between lg:flex-row gap-16 lg:items-center">
        {/* قسم الصور */}
        <div className="flex flex-col gap-12 lg:w-[40%] border order-2 lg:order-0">
          <div className="w-full h-[300px] flex items-center justify-center">
            <img src={activeImg} alt={title} className="h-full object-cover" />
          </div>
          {images?.length > 0 && (
            <div className="flex flex-row justify-center items-center gap-5 border w-full h-[130px] border">
              {images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={title}
                  className="h-full w-[100px] rounded-md cursor-pointer object-contain"
                  onClick={() => setActiveImage(url)}
                />
              ))}
            </div>
          )}
        </div>

        {/* قسم التفاصيل */}
        <div className="flex flex-col gap-4 lg:w-2/4 order-0 lg:order-2">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p>{briefDesc}</p>
          <div
            dangerouslySetInnerHTML={{
              __html: showMore[_id]
                ? content || ""
                : `${(content || "").substring(0, 1000)}...`, // Limit the content to 1000 characters
            }}
          />
          <button onClick={() => toggleShowMore(_id)}>
            {showMore[_id] ? "عرض أقل" : "عرض المزيد..."}
          </button>
          <h6 className="text-2xl font-semibold">${price}</h6>

          {/* منتقي الكمية */}
          <div className="flex flex-row items-center gap-12">
            <div className="flex flex-row items-center">
              <button
                className="bg-gray-200 py-2 px-5 rounded-lg text-emerald-500 text-3xl"
                onClick={() => setAmount((prev) => Math.max(prev - 1, 1))} // Prevent negative quantity
              >
                -
              </button>
              <span className="py-4 px-6 rounded-lg">{amount}</span>
              <button
                className="bg-gray-200 py-2 px-4 rounded-lg text-emerald-500 text-3xl"
                onClick={() => setAmount((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="bg-emerald-500 text-white font-semibold py-3 px-16 rounded-xl h-full"
              onClick={handleAddToCart}
            >
              إضافة إلى السلة
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsProductComp;
