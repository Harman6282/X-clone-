import { Outlet } from "react-router-dom";

function StandaloneLayout() {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <Outlet />
    </div>
  );
}

export default StandaloneLayout;