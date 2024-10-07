import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/loginSlice";
import hotelLoginImg from "../assets/hotelLoginImg.png";

const Login= () => {
  const [userName, setUserName] = useState(""); // Typed useState
  const [userPassword, setPassword] = useState(""); // Typed useState
  const dispatch = useDispatch() // Typed dispatch with AppDispatch
  const navigate = useNavigate();
  
  const { isAuthenticated, loading, error } = useSelector((state) => state.login); // Typed useSelector with RootState

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/layout");
  //   }
  // }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const credential = {
      userName,
      userPassword, // Assuming password should be a number
    };
    dispatch(login(credential)); // Dispatch the login action
  };

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-full h-full flex p-[10%]">
        {/* Left side with Image */}
        <div className="w-1/2 hidden lg:block">
          <img src={hotelLoginImg} alt="Hotel Login" className="w-full h-full object-cover" />
        </div>

        {/* Right side with Login form */}
        <div className="w-full lg:w-1/2 p-10 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-gray-700 text-left">Login</h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">User Name</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={userPassword}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-green-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-300 focus:outline-none disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
