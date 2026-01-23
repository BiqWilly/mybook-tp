import { useNavigate } from "react-router-dom";


export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="mb-4">Page not found</p>
      <button
        onClick={() => navigate("/login")}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Back to Login
      </button>
    </div>
  );
}
