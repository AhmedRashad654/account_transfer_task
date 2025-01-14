import { Outlet } from "react-router-dom";
import Navbar from "./componants/Navbar";


export default function Layout() {
  return (
    <div className="">
      <Navbar />
      <div className="p-5">
        <Outlet />
      </div>
    </div>
  );
}
