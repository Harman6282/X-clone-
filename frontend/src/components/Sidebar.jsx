import {
  Home,
  User,
  Bell,
  Mail,
  Bookmark,
  List,
  Hash,
  MoreHorizontal,
} from "react-feather";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function SidebarLink({ Icon, text, onClick, active }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 hover:bg-[#181818] rounded-full cursor-pointer transition duration-200 ${
        active ? "font-bold" : ""
      }`}
    >
      <Icon className="h-6 w-6" />
      <span className="hidden xl:inline text-lg">{text}</span>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="hidden sm:flex flex-col h-screen xl:w-64 w-20 p-2 text-white">
      <div className="flex items-center justify-center xl:justify-start p-3 hover:bg-gray-800 rounded-full cursor-pointer">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </g>
        </svg>
      </div>

      <div className="">
      <Link to={"/"}>
        <SidebarLink Icon={Home} text="Home" />

      </Link>
        <SidebarLink Icon={Hash} text="Explore" />
        <SidebarLink Icon={Bell} text="Notifications" />
        <SidebarLink Icon={Mail} text="Messages" />
        <SidebarLink Icon={Bookmark} text="Bookmarks" />
        <SidebarLink Icon={List} text="Lists" />
        <Link to={"/profile"}>
          <SidebarLink Icon={User} text="Profile" />
        </Link>
        <SidebarLink Icon={MoreHorizontal} text="More" />
      </div>

      <button className="bg-blue-500 text-white rounded-full p-4 mt-4 hover:bg-blue-600 transition duration-200">
        <span className="hidden xl:inline">Post</span>
        <span className="xl:hidden">+</span>
      </button>
    </div>
  );
}

export default Sidebar;

SidebarLink.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  active: PropTypes.bool,
};