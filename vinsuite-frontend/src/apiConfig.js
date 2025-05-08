const BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:8081/api";

const API = {
  BASE_URL,
  AUTH: `${BASE_URL}/auth`,
  PROJECTS: `${BASE_URL}/projects`,
  TEST_CASES: `${BASE_URL}/groq`, 
  OPENAI_XPATH: `${BASE_URL}/openai-xpath`, 
  BACKUP: `${BASE_URL}/backup`,
  QUERY: `${BASE_URL}/dba`,
  SCHEMA: `${BASE_URL}/schema`,
  ACCESSIBILITY: `${BASE_URL}/accessibility`,
  FRAMEWORK: `${BASE_URL}/qa/framework`,
  OCR_TEST_CASES: `${BASE_URL}/vision/generate-ocr-testcases`,
  UNIT_TEST_GENERATOR: `${BASE_URL}/dev/unit-test` ,
  AI_REVIEWER: `${BASE_URL}/dev/ai-review` 
};

export default API;
