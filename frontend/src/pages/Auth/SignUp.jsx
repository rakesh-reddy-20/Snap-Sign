import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "./../../utils/axiosInstance";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        { name, email, password },
        { withCredentials: true }
      );

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser({ token });
        navigate("/admin/dashboard");
      }
      toast.success("Registered successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create your SnapSign Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              autoFocus
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
              value={formData.name}
              onChange={handleChange}
              placeholder="Rakesh Reddy"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full font-semibold bg-blue-600 hover:bg-blue-300 text-white py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
          >
            Register
          </button>
        </form>
        <p className="text-x font-semibold text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
