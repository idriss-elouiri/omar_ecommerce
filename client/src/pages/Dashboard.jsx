import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/Dashboard/DashSidebar";
import DashProfile from "../components/Dashboard/DashProfile";
import DashProducts from "../components/Dashboard/DashProduct";
import DashUsers from "../components/Dashboard/DashUsers";
import DashComments from "../components/Dashboard/DashComments";
import DashCategories from "../components/Dashboard/DashCatgory";
import DashOrders from "../components/Dashboard/DashOrders";
import DashboardComp from "../components/Dashboard/DashComp";
import MyOrder from "../components/Dashboard/myOrder/MyOrder";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === "profile" && <DashProfile />}
      {/* products... */}
      {tab === "products" && <DashProducts />}
      {/* users */}
      {tab === "users" && <DashUsers />}
      {/* comments  */}
      {tab === "comments" && <DashComments />}
      {/* category  */}
      {tab === "categories" && <DashCategories />}
      {/* orders  */}
      {tab === "orders" && <DashOrders />}
      {tab === "my-order" && <MyOrder />}
      {/* dashboard comp */}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
}
