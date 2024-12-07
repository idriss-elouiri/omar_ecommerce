import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { CgShoppingCart } from "react-icons/cg";
import { IoIosSettings } from "react-icons/io";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../../redux/user/userSlice";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get("tab");
    if (tabFromUrl) setActiveTab(tabFromUrl);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) dispatch(signoutSuccess());
      else console.log("فشل في تسجيل الخروج");
    } catch (error) {
      console.log("خطأ في تسجيل الخروج:", error.message);
    }
  };

  const sidebarItems = [
    {
      label: "اللوحة الرئيسية",
      icon: HiChartPie,
      tab: "dash",
      adminOnly: true,
    },
    {
      label: "الملف الشخصي",
      icon: HiUser,
      tab: "profile",
    },
    {
      label: "المنتجات",
      icon: HiDocumentText,
      tab: "products",
      adminOnly: true,
    },
    {
      label: "المستخدمون",
      icon: HiOutlineUserGroup,
      tab: "users",
      adminOnly: true,
    },
    {
      label: "التعليقات",
      icon: HiAnnotation,
      tab: "comments",
      adminOnly: true,
    },
    {
      label: "الفئات",
      icon: IoIosSettings,
      tab: "categories",
      adminOnly: true,
    },
    // Show "الطلبات" for admins only
    {
      label: "الطلبات",
      icon: CgShoppingCart,
      tab: "orders",
      adminOnly: true,
    },
    // Show "طلباتي" for non-admin users only
    {
      label: "طلباتي",
      icon: CgShoppingCart,
      tab: "my-order",
      adminOnly: false,
    },
  ];

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {sidebarItems.map(({ label, icon, tab, adminOnly = false }) => {
            // Render admin-only items for admin users
            if (adminOnly && currentUser?.isAdmin) {
              return (
                <Link key={tab} to={`/dashboard?tab=${tab}`}>
                  <Sidebar.Item active={activeTab === tab} icon={icon} as="div">
                    {label}
                  </Sidebar.Item>
                </Link>
              );
            }

            // Render non-admin-only items for non-admin users
            if (!adminOnly && !currentUser?.isAdmin) {
              return (
                <Link key={tab} to={`/dashboard?tab=${tab}`}>
                  <Sidebar.Item active={activeTab === tab} icon={icon} as="div">
                    {label}
                  </Sidebar.Item>
                </Link>
              );
            }

            // Hide irrelevant items
            return null;
          })}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            تسجيل الخروج
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
