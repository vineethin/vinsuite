export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Ensure JSON content-type
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).json({ message: "Content-Type must be application/json" });
  }

  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "Valid URL is required" });
  }

  const safeUrl = url.trim().toLowerCase();
  const suggestions = [];

  if (safeUrl.includes("/login")) {
    suggestions.push(
      "Test valid and invalid logins",
      "Check error message on failure",
      "Validate redirect on success",
      "Ensure required field validation"
    );
  } else if (safeUrl.includes("/register") || safeUrl.includes("/signup")) {
    suggestions.push(
      "Test for empty form submission",
      "Validate email and password rules",
      "Check duplicate email handling",
      "Verify success message or redirection"
    );
  } else {
    suggestions.push(
      "Verify page load and 200 status",
      "Check for broken UI elements",
      "Run basic accessibility audit",
      "Identify missing alt tags or labels"
    );
  }

  return res.status(200).json({ suggestions });
}
