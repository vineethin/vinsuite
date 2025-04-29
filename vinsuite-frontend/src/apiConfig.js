// ✅ Centralized API URL config for VinSuite

const BASE_URL = process.env.REACT_APP_API_BASE || "https://vinsuite.onrender.com/api";

const API = {
  AUTH: `${BASE_URL}/auth`,
  PROJECTS: `${BASE_URL}/projects`,
  TEST_CASES: `${BASE_URL}/groq`,
  BACKUP: `${BASE_URL}/backup`,
  QUERY: `${BASE_URL}/dba`,
  SCHEMA: `${BASE_URL}/schema`,
  ACCESSIBILITY: `${BASE_URL}/accessibility`
};

export default API;
