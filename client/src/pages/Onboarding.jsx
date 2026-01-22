import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (!storedUser) navigate("/login");
    else setUser(storedUser);
  }, [navigate]);

  const [course, setCourse] = useState("");
  const [interests, setInterests] = useState([]);
  const [readingFreq, setReadingFreq] = useState("");

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleFinishOnboarding = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full bg-red-600 py-16 px-8 flex flex-col items-center rounded-b-[4rem] shadow-xl">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">WELCOME, {user?.name?.toUpperCase()}!</h1>
        <p className="text-red-100 font-bold">Personalize your reading experience</p>
      </div>

      <div className="w-full max-w-lg p-10 -mt-8 bg-white rounded-[3rem] shadow-2xl space-y-8 border border-gray-100 mb-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Course of Study</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none focus:ring-4 focus:ring-red-100 transition-all appearance-none cursor-pointer">
              <option value="">Select your course</option>
              <option>Computer Science</option>
              <option>Engineering</option>
              <option>Business</option>
              <option>Arts</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">What do you like to read?</label>
            <div className="flex flex-wrap gap-3 p-2">
              {["Fiction", "Science", "History", "Productivity", "Business"].map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all border-2 ${
                    interests.includes(interest) 
                    ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-200" 
                    : "bg-white text-gray-500 border-gray-100 hover:border-red-200"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Reading Frequency</label>
            <div className="grid grid-cols-2 gap-3">
              {["Daily", "Weekly", "Monthly", "Rarely"].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setReadingFreq(freq)}
                  className={`p-4 rounded-2xl font-bold transition-all border-2 ${
                    readingFreq === freq 
                    ? "bg-red-50 text-red-600 border-red-500 shadow-inner" 
                    : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleFinishOnboarding} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95">
          GO TO LIBRARY
        </button>
      </div>
    </div>
  );
}