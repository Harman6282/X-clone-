import Sidebar from "./components/Sidebar";
import Widgets from "./components/Widgets"
import { Outlet } from "react-router-dom";


function App() {
  return (
   <div className="flex w-5/6 mx-auto ">
    <Sidebar />
    <Outlet className="xl:w-[667px]" />
    <Widgets />

   </div>
  );
}

export default App;
