import { useState } from "react";
import API_URL from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/onboarding");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full bg-emerald-600 py-20 px-8 flex flex-col items-center rounded-b-[4rem] shadow-2xl">
        <h1 className="text-5xl font-black text-white tracking-tighter mb-2 uppercase">Join MyBook</h1>
        <p className="text-emerald-100 font-bold text-lg text-center">Access thousands of books at TP</p>
      </div>

      <div className="w-full max-w-md p-10 -mt-12 bg-white rounded-[3rem] shadow-2xl border border-gray-50">
        <h2 className="text-3xl font-black text-gray-800 mb-8 text-center uppercase tracking-tight">Register</h2>
        {error && <p className="mb-4 text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-xl">{error}</p>}
        <form className="space-y-5" onSubmit={handleSignup}>
          <div className="space-y-1">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Full Name</label>
            <input
              type="text"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-100 transition-all outline-none font-bold"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="William Tan"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">TP Email</label>
            <input
              type="email"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-100 transition-all outline-none font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Password</label>
            <input
              type="password"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-100 transition-all outline-none font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95">
            CREATE ACCOUNT
          </button>
        </form>
        <p className="mt-8 text-center text-gray-500 font-bold">
          Already a member? <Link to="/login" className="text-emerald-600 hover:underline ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
}