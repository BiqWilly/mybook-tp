import { useState } from "react";
import API_URL from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        if (data.role === 'admin') navigate("/admin");
        else navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full bg-red-600 py-20 px-8 flex flex-col items-center rounded-b-[4rem] shadow-2xl">
        <h1 className="text-5xl font-black text-white tracking-tighter mb-2 uppercase">MyBook @ TP</h1>
        <p className="text-red-100 font-bold text-lg">Your Campus Digital Library</p>
      </div>

      <div className="w-full max-w-md p-10 -mt-12 bg-white rounded-[3rem] shadow-2xl border border-gray-50">
        <h2 className="text-3xl font-black text-gray-800 mb-8 text-center uppercase tracking-tight">Login</h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
            <input
              type="email"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-red-100 transition-all outline-none font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@tp.edu.sg"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Password</label>
            <input
              type="password"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-red-100 transition-all outline-none font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95">
            SIGN IN
          </button>
        </form>
        
        <div className="mt-8 space-y-4 text-center">
            <p className="text-gray-500 font-bold">
              New here? <Link to="/signup" className="text-red-600 hover:underline ml-1">Create Account</Link>
            </p>
            {/* Librarian Shortcut */}
            <div className="pt-4 border-t border-gray-100">
                <Link to="/admin" className="text-xs font-black text-gray-300 hover:text-red-400 uppercase tracking-widest transition-colors">
                    Librarian Portal Access
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}