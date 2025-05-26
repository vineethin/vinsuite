const BASE_URL =
  process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE !== ""
    ? process.env.REACT_APP_API_BASE
    : "";

// If BASE_URL is empty, it will use React's proxy setting for local development.

const API = {
  BASE_URL,
  AUTH: `${BASE_URL}/api/auth`,
  PROJECTS: `${BASE_URL}/api/projects`,
  TEST_CASES: `${BASE_URL}/groq`,
  OPENAI_XPATH: `${BASE_URL}/openai-xpath`,
  BACKUP: `${BASE_URL}/api/backup`,
  QUERY: `${BASE_URL}/api/dba`,
  SCHEMA: `${BASE_URL}/api/schema`,
  ACCESSIBILITY: `${BASE_URL}/api/accessibility`,
  FRAMEWORK: `${BASE_URL}/qa/framework`,
  OCR_TEST_CASES: `${BASE_URL}/api/vision/generate-ocr-testcases`,
  UNIT_TEST_GENERATOR: `${BASE_URL}/api/dev/unit-test`,
  AI_REVIEWER: `${BASE_URL}/api/dev/ai-review`,
  PERFORMANCE: `${BASE_URL}/qa/performance`,
  WRITER: `${BASE_URL}/api/writer`,
  WEB_DEFECT_SCANNER: `${BASE_URL}/qa/defect-scan`,
};

export default API;
