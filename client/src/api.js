// client/src/api.js
const API_URL = import.meta.env.MODE === 'development' 
  ? "http://localhost:5000" 
  : "https://mybooktp-rnze5aqz0-williams-projects-9f6f755b.vercel.app"; 

export default API_URL;