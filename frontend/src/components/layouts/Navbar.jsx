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
      {/* Fixed Navbar */}
      <header className="w-full fixed top-0 left-0 right-0 z-50 bg-white px-6 py-4 flex items-center justify-between shadow-sm border-b">
        {/* Left: Logo + App Name */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="SnapSign Logo" className="h-10 w-10" />
          <span className="text-xl font-semibold text-gray-800">Snap Sign</span>
        </div>

        {/* Right: Navigation + Avatar */}
        <div className="flex items-center gap-4">
          {/* Navigation links only on medium and larger screens */}
          <div className="hidden md:flex gap-4">
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
          </div>

          {/* Avatar + Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/profile.png" alt="User" />
                <AvatarFallback>
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "SS"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {!loading && (
                <>
                  <DropdownMenuItem className="font-semibold mb-2">
                    Hello {user?.name || "User"}
                  </DropdownMenuItem>
                  <hr />

                  {/* Navigation links only on small screens */}
                  <div className="block md:hidden">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Home</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/about">About</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/uploads">Show my uploads</Link>
                    </DropdownMenuItem>
                    <hr className="my-1" />
                  </div>

                  <DropdownMenuItem className="font-semibold mt-2">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="font-semibold">
                    Settings
                  </DropdownMenuItem>
                </>
              )}
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

      {/* Main Content with padding to offset fixed header */}
      <main className="flex-grow flex flex-col px-6 py-4 pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;
