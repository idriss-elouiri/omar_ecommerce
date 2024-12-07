import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaLongArrowAltRight } from "react-icons/fa";
import Button from "../Button";
import { Link } from "react-router-dom";

const sliderSettings = {
  dots: false,
  infinite: true,
  arrows: false,
  speed: 800,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  cssEase: "ease-in-out",
  pauseOnHover: false,
  pauseOnFocus: true,
};

const Hero = () => {
  const [productsInfo, setProductsInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts?limit=5`
        );
        if (!res.ok) throw new Error("فشل في جلب المنتجات");
        const data = await res.json();
        setProductsInfo(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  return (
    <div className="w-[90%] mx-auto my-10">
      <div className="overflow-hidden rounded-3xl min-h-[550px] sm:min-h-[650px] hero-bg-color flex justify-center items-center">
        <div className="container pb-8 sm:pb-0">
          <Slider {...sliderSettings}>
            {productsInfo.map(({ id, title, briefDesc, slug, images }) => (
              <div key={id}>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="flex flex-col justify-center gap-4 md:pl-3 pt-12 md:pt-0 text-center md:text-left order-2 md:order-1 relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold">{title}</h1>
                    <p className="text-slate-600">{briefDesc}</p>
                    <div className="flex items-center gap-3">
                      <p className="flex items-center text-primary px-4 py-2 bg-brandWhite rounded-full gap-3 font-semibold">
                        عرض حصري -50% <FaLongArrowAltRight />
                      </p>
                      <Link
                        to={`/product-details/${slug}`}
                        className="underline font-semibold"
                      >
                        اشتري الآن
                      </Link>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <img
                      src={images[0]}
                      alt={title}
                      className="lg:w-[350px] lg:h-[350px] md:h-[280px] md:w-[280px] h-[350px] w-[350px] object-contain mx-auto drop-shadow-[-8px_4px_6px_rgba(0,0,0,.4)] z-40 relative"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Hero;
