const BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:8081/api";

const API = {
  AUTH: `${BASE_URL}/auth`,
  PROJECTS: `${BASE_URL}/projects`,
  TEST_CASES: `${BASE_URL}/groq`, // keep this if used elsewhere
  OPENAI_XPATH: `${BASE_URL}/openai-xpath`, // ✅ Add this line
  BACKUP: `${BASE_URL}/backup`,
  QUERY: `${BASE_URL}/dba`,
  SCHEMA: `${BASE_URL}/schema`,
  ACCESSIBILITY: `${BASE_URL}/accessibility`,
  FRAMEWORK: `${BASE_URL}/qa/framework`
};

export default API;
