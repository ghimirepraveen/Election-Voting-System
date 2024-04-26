import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EnterPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    if (!email || !role) {
      setError("Email or role not found in localStorage");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        { email, role, password }
      );
      console.log("Login Response:", response.data.token);
      Cookies.set("token", response.data.token);
      //console.log value of token in cookie
      console.log("Token:", Cookies.get("token"));
      navigate("/profile");
    } catch (error) {
      console.error("Login Error:", error.response.data);

      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Enter Password
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-xl mt-9 font-medium  text-gray-700 "
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnterPassword;
