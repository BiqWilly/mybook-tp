// client/src/api.js
const API_URL = import.meta.env.MODE === 'development'
  ? "http://localhost:5000" 
  : "https://mybook-backend-glec.onrender.com"; 

export default API_URL;