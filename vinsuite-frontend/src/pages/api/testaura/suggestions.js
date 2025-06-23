// pages/api/testaura/suggestions.js

export default async function handler(req, res) {
  // 1. Ensure POST method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // 2. Content-Type check
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).json({ message: "Content-Type must be application/json" });
  }

  const { url } = req.body;

  // 3. Input validation
  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "Valid URL is required" });
  }

  // 4. Normalize and parse URL
  let parsedPath = "";
  let host = "";
  try {
    const fullUrl = url.startsWith("http") ? url : `http://${url}`;
    const parsed = new URL(fullUrl);
    parsedPath = parsed.pathname.toLowerCase();
    host = parsed.hostname;
  } catch (err) {
    return res.status(400).json({ message: "Invalid URL format" });
  }

  // 5. Route type and heuristic detection
  let matchedRoute = "general";
  const isApi = parsedPath.includes("/api") || parsedPath.match(/\/v\d+\//);

  // 6. Suggestions based on path
  const suggestions = [];

  if (isApi) {
    matchedRoute = "api";
    suggestions.push(
      "Verify response status codes (200, 400, 500)",
      "Check response body structure/schema",
      "Test required and optional parameters",
      "Validate error messages and edge cases",
      "Ensure correct authentication headers"
    );
  } else if (parsedPath.includes("/login")) {
    matchedRoute = "login";
    suggestions.push(
      "Test valid and invalid login credentials",
      "Verify error messages for failures",
      "Check redirect behavior after login",
      "Ensure required field validation"
    );
  } else if (parsedPath.includes("/register") || parsedPath.includes("/signup")) {
    matchedRoute = "registration";
    suggestions.push(
      "Test empty form submission",
      "Validate email/password formats",
      "Check for duplicate user errors",
      "Verify registration success behavior"
    );
  } else if (parsedPath.includes("/dashboard")) {
    matchedRoute = "dashboard";
    suggestions.push(
      "Ensure dashboard widgets render correctly",
      "Test API integration and initial data load",
      "Check layout responsiveness across devices"
    );
  } else if (parsedPath.includes("/profile") || parsedPath.includes("/account")) {
    matchedRoute = "profile";
    suggestions.push(
      "Test updating user profile fields",
      "Validate input formatting (e.g., email, phone)",
      "Verify profile picture upload and display"
    );
  } else {
    matchedRoute = "general";
    suggestions.push(
      "Verify page returns 200 OK status",
      "Check for broken or misaligned UI components",
      "Run accessibility checks (alt tags, ARIA roles)",
      "Test mobile responsiveness"
    );
  }

  // 7. Return structured response
  return res.status(200).json({
    suggestions,
    context: {
      matchedRoute,
      originalUrl: url,
      parsedPath,
      host,
      type: isApi ? "API" : "Web",
    },
  });
}
