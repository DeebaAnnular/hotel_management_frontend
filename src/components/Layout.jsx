import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className=" h-screen w-full flex flex-col">
        <Header/>
        <main className=" h-[92%] w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
