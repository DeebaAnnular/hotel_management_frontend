import React from "react";
import { FaBell } from "react-icons/fa";
import { Switch, Button } from "@material-tailwind/react";
import { IoMdLogOut } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUserName } from "../redux/slices/loginSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useSelector(selectUserName);
  const firstLetter = username?.charAt(0).toUpperCase() || "";
  const requestCount = useSelector((state) => state.generalRequests.count);


  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="w-full h-[8%] bg-white flex items-center justify-between px-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] relative z-10">
      <div className="flex items-center"></div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-evenly w-[18rem] bg-darkGray p-2 rounded">
          {/* <Switch
            id="custom-switch-component"
            ripple={false}
            className="h-full w-full checked:bg-[#228b22]"
            containerProps={{
              className: "w-8 h-4",
            }}
            circleProps={{
              className: "h-4 w-4 before:hidden left-0.5 border-none",
            }}
          /> */}
          <p className="flex items-center">
            <FaBell className="mr-1" />
            Request- {requestCount}
          </p>
          <p className="h-6 w-6 rounded-full bg-purpleColor flex items-center justify-center text-white">
            {firstLetter}
          </p>
          <p className="">{username}</p>
        </div>

        <Button
          className="rounded-md bg-redBtn flex items-center justify-center"
          onClick={handleLogout}
        >
          <IoMdLogOut className="text-xl mr-2" /> <p>Logout</p>
        </Button>
      </div>
    </div>
  );
};

export default Header;