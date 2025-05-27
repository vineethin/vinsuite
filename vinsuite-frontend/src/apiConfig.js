const BASE_URL =
  process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE !== ""
    ? process.env.REACT_APP_API_BASE
    : "";

// If BASE_URL is empty, it will use React's proxy setting for local development.

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
  UNIT_TEST_GENERATOR: `${BASE_URL}/dev/unit-test`,
  AI_REVIEWER: `${BASE_URL}/dev/ai-review`,
  PERFORMANCE: `${BASE_URL}/qa/performance`,
  WRITER: `${BASE_URL}/writer`,
  WEB_DEFECT_SCANNER: `${BASE_URL}/qa/defect-scan`,
  VIEW_USER_COUNT: `${BASE_URL}/admin/users/count`,
  VIEW_USERS: `${BASE_URL}/admin/users`, 
};

export default API;
