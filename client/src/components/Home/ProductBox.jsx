import { Link } from "react-router-dom";
import { addItem } from "../../redux/cart/cartSlice";
import { useDispatch } from "react-redux";
import React, { useState } from "react";

const ProductBox = React.memo(({ productInfo }) => {
  const dispatch = useDispatch();
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => setShowMore((prev) => !prev);

  return (
    <div className="w-[300px] border rounded-xl p-2 shadow-md hover:shadow-lg transition-shadow duration-300">
  <div className="bg-slate-100 p-2 rounded-xl">
    <Link to={`/product-details/${productInfo.slug}`}>
      {productInfo.images[0] ? (
        <img
          src={productInfo.images[0]}
          className="w-full h-[150px] object-contain"
          alt={productInfo.title} // Use a meaningful alt text
        />
      ) : (
        <div className="w-full h-[150px] bg-gray-200 flex items-center justify-center text-gray-400">
          لا توجد صورة متاحة
        </div>
      )}
    </Link>
  </div>
  <div className="mt-2">
    <Link to={`/product-details/${productInfo.slug}`}>
      <h3 className="font-bold text-[14px]">{productInfo.title}</h3>
    </Link>
  </div>
  <p className="text-sm my-4 leading-4 text-gray-500 line-clamp-3">
    {showMore
      ? productInfo.briefDesc
      : `${productInfo.briefDesc.substring(0, 100)}...`}{" "}
    {/* Truncate description */}
    {productInfo.briefDesc.length > 100 && (
      <span
        onClick={toggleShowMore}
        className="text-blue-500 cursor-pointer"
      >
        {showMore ? "عرض أقل" : "عرض المزيد"}
      </span>
    )}
  </p>
  <div className="flex mt-1 items-center">
    <div className="text-2xl font-bold grow">
      ${productInfo.price.toFixed(2)}
    </div>
    <button
      className="bg-emerald-400 text-white py-1 px-3 rounded-xl"
      onClick={() => dispatch(addItem(productInfo))}
      aria-label={`أضف ${productInfo.title} إلى السلة`} // Add aria-label for accessibility
    >
      +
    </button>
  </div>
  <Link
    to={`/product-details/${productInfo.slug}`}
    className="underline hover:text-primary py-3"
  >
    اقرأ المزيد...
  </Link>
</div>

  );
});

export default ProductBox;
