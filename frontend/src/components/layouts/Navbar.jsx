import { useContext } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/userContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, loading, updateUser, clearUser } = useContext(UserContext);

  const logout = () => {
    toast.success("Logout successfully!");
    clearUser();
    navigate("/login");
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="w-full border-b bg-white px-6 py-4 flex items-center justify-between shadow-sm">
        {/* Left: Logo + App Name */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="SnapSign Logo" className="h-10 w-10" />
          <span className="text-xl font-semibold text-gray-800">Snap Sign</span>
        </div>

        {/* Right: Upload Button + Dropdown */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-sm text-gray-700 font-medium hover:text-blue-600 transition"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm text-gray-700 font-medium hover:text-blue-600 transition"
          >
            About
          </Link>
          <Link
            to="/uploads"
            className="text-sm text-gray-700 font-medium hover:text-blue-600 transition"
          >
            Show my uploads
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/profile.png" alt="User" />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="font-semibold mb-2 ">
                Hello {user?.name || "User"}
              </DropdownMenuItem>
              <hr />
              <DropdownMenuItem className="font-semibold mt-2">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="font-semibold">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-700 font-semibold"
                onClick={logout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col px-6 py-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;
