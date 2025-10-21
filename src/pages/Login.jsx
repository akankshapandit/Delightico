import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          Welcome Back
        </h1>
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none px-4 py-2 rounded-lg w-full transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none px-4 py-2 rounded-lg w-full transition"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg w-full transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/Register"
            className="text-green-700 font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
