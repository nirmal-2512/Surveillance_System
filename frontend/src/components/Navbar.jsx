import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-primary text-white px-7 py-4 flex items-center justify-between flex-wrap">
      <div className="text-3xl font-bold">Surveillance System</div>
      <div className="text-xl flex gap-8 px-6">
        <div className="">
          <Link to="/" className="hover:text-[#0B192C]">
            About
          </Link>
        </div>
        <div className="">
          <Link to="/features" className="hover:text-[#0B192C]">
            Features
          </Link>
        </div>

        {user ? (
          <div className="flex gap-6">
            <Link to="/dashboard" className="text-white hover:text-orange-400">
              Dashboard
            </Link>
            <button
              className="rounded-full"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {user?.name}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded shadow-lg z-10 text-black">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setDropdownOpen(false);
                  }}
                  className="block rounded w-full px-4 py-2 hover:bg-[#0B192C] hover:text-white"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block rounded w-full px-4 py-2 hover:bg-[#0B192C] hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="">
            <Link
              to="/login"
              className="px-4 py-2 text-white hover:text-orange-400"
            >
              Login
            </Link>
          </div>
        )}
      </div>
      {/* Mobile menu will go here */}
    </nav>
  );
};

export default Navbar;
