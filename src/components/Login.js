import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdRemoveRedEye } from "react-icons/md";
import { IoEyeOffSharp } from "react-icons/io5";
import toast from "react-hot-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://stg.dhunjam.in/account/admin/login",
        {
          username,
          password,
        }
      );

      console.log(response);

      if (response.status === 200 && response.data.response === "Success") {
        const userData = response.data.data;

        if (userData && userData.id) {
          // Assuming the login is successful and the data contains the required information
          navigate(`/admin-dashboard/${userData.id}`);
          toast.success("Signed in");
        } else {
          // Handle missing user id or other required information
          toast.error("Invalid response data");
        }
      } else {
        // Handle login failure
        toast.error("Signed in Failed");
      }
    } catch (error) {
      // Handle error
      toast.error("Error during login");
      console.error("Error during login", error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[40%] h-auto mx-auto p-2 flex flex-col justify-center items-center">
        <h1 className="font-bold text-[32px] my-5">Venue Admin login</h1>
        <form className="flex flex-col gap-5">
          <input
            className="w-full sm:w-[400px] text-[16px] bg-transparent text-[#FFFFFF] border border-white rounded-xl p-3"
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="relative">
            <input
              className="w-full sm:w-[400px] text-[16px] bg-transparent text-[#FFFFFF] border border-white rounded-xl p-3"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <IoEyeOffSharp className="text-[25px]" />
              ) : (
                <MdRemoveRedEye className="text-[25px]" />
              )}
            </button>
          </div>

          <button
            className="w-full sm:w-[400px] text-[16px] mt-5 bg-[#6741D9] p-3 rounded-xl font-bold"
            type="button"
            onClick={handleLogin}
          >
            Sign in
          </button>
        </form>
        <div className="my-5 text-[16px]">
          <a href="/">New Registration?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
