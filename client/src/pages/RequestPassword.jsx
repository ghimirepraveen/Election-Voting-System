import { useState } from "react";
import axios from "axios";
import ToggleSwitch from "../components/toogle";
import { useNavigate } from "react-router-dom";

function RequestPassword() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/reqpassword",
        { email, role: role ? "CANDIDATE" : "VOTER" }
      );

      console.log("Response:", response.data);

      // Store email and role in localStorage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", role ? "CANDIDATE" : "VOTER");

      navigate("/login");
    } catch (error) {
      console.error("Error:", error.response.data);

      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-semibold mb-4 text-center">Login</h1>
        <p className=" font-light text-center mt-8">login as</p>
        <ToggleSwitch role={role} setRole={setRole} />

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-xl mt-9 font-medium  text-gray-700 "
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="abcd@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Send Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestPassword;
