import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);

  const handleSubmit = (e) => {
    e.preventDefault();
    urlParams.set("searchTerm", searchTerm);
    const searchQ = urlParams.toString();
    navigate(`/search?${searchQ}`);
  };

  useEffect(() => {
    const searchFromUrl = urlParams.get("searchTerm");
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1
          className="font-bold text-sm sm:text-xl flex flex-row cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-slate-500">MERN</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <Link to={"/"}>
            <li className="text-slate-700 hover:underline cursor-pointer hidden sm:inline transition-all text-base font-semibold">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="text-slate-700 hover:underline cursor-pointer hidden sm:inline transition-all text-base font-semibold">
              About
            </li>
          </Link>
          {currentUser ? (
            <Link to={"/profile"}>
              <img
                src={currentUser.avatar}
                alt={"profile"}
                className="h-7 w-7 rounded-full object-contain"
              />
            </Link>
          ) : (
            <Link to={"/signin"}>
              <li className="text-slate-700 hover:underline cursor-pointer transition-all text-base font-semibold">
                Sign In
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
