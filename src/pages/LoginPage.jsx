import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/loginSlice";
import hotelLoginImg from "../assets/hotelLoginImg.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import eye icons

const Login = () => {
  const [userName, setUserName] = useState(""); 
  const [userPassword, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  
  const { isAuthenticated, loading, loginError } = useSelector((state) => state.login);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful!");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (loginError) {
      toast.error(loginError);
    }
  }, [loginError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const credential = {
      userName,
      userPassword,
    };
    dispatch(login(credential));
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
            <div className="mb-4 relative"> {/* Added relative position for the eye icon */}
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password
                placeholder="Enter your password"
                value={userPassword}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-green-500"
                required
              />
              {/* Eye icon for showing/hiding password */}
              <span 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-10 cursor-pointer" // Adjust position as needed
              >
                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-300 focus:outline-none disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
            <ToastContainer />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
