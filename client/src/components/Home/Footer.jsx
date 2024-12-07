import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const FooterLinks = [
    {
      title: "الرئيسية",
      link: "/",
    },
    {
      title: "عن الشركة",
      link: "/about",
    },
    {
      title: "اتصل بنا",
      link: "/contact",
    },
    {
      title: "المنتجات",
      link: "/product-page",
    },
  ];

  return (
    <div>
      <div className="w-[90%] mx-auto">
        <div className="grid lg:grid-cols-3 pb-20 pt-5">
          <div className="py-8 px-4">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-primary rounded-md text-white">
                عمر
              </span>
              الكترونيات
            </Link>
            <p className="text-gray-600 pt-3">
              نص تجريبي يشرح محتويات الموقع والتقنيات المستخدمة فيه.
            </p>
            <p className="text-gray-500 mt-4">صُنع بواسطة The Coding</p>
          </div>

          <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 md:pl-10">
            <div className="py-8 px-4">
              <h1 className="text-xl font-bold sm:text-left mb-3">
                الروابط المهمة
              </h1>
              <ul className="space-y-3">
                {FooterLinks.map((data, index) => (
                  <li key={index}>
                    <Link
                      to={data.link}
                      className="text-gray-600 hover:text-black duration-300"
                    >
                      {data.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="py-8 px-4">
              <h1 className="text-xl font-bold sm:text-left mb-3">
                الروابط السريعة
              </h1>
              <ul className="space-y-3">
                {FooterLinks.map((data, index) => (
                  <li key={index}>
                    <Link
                      to={data.link}
                      className="text-gray-600 hover:text-black duration-300"
                    >
                      {data.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="py-8 px-4 col-span-2 sm:col-auto">
              <h1 className="text-xl font-bold sm:text-left mb-3">العنوان</h1>
              <div>
                <div className="flex items-center gap-3 mt-6">
                  <FaLocationArrow />
                  <p>الدار البيضاء, البرنوصي</p>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <FaMobileAlt />
                  <p>0621541569</p>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <Link to={"https://www.instagram.com/omartahir25/"}>
                    <FaInstagram className="text-2xl hover-text-black duration-200 hover:text-primary" />
                  </Link>
                  <Link to={"#"}>
                    <FaLinkedin className="text-2xl hover-text-black duration-200 hover:text-primary" />
                  </Link>
                  <Link to={"#"}>
                    <FaFacebook className="text-2xl hover-text-black duration-200 hover:text-primary" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
