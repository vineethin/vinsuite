// src/components/qa/TestAura/useTestAuraLogic.js
import { useState } from "react";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_BASE || "/api";

// ✅ Exported for reuse in UI components
export const isValidUrl = (val) => {
  try {
    const parsed = new URL(val);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function useTestAuraLogic() {
  const [url, setUrl] = useState("");
  const [suggestions, setSuggestions] = useState({});
  const [selectedTests, setSelectedTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const speak = (text) => {
    try {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
      } else {
        toast.warn("Speech synthesis not supported.");
      }
    } catch (e) {
      console.error("Speech synthesis error:", e);
      toast.warn("Failed to speak.");
    }
  };

  const handleVoiceCommand = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech Recognition is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.start();
      setRecording(true);

      recognition.onresult = (event) => {
        const speech = event.results[0][0].transcript;
        if (!speech.trim()) {
          toast.warn("No voice input detected.");
          setRecording(false);
          return;
        }

        setTranscript(speech);
        setUrl(speech);
        setRecording(false);
        toast.info(`Heard: "${speech}"`);
        speak(`You said: ${speech}`);
        handleSubmit(speech);
      };

      recognition.onerror = (e) => {
        console.error("Speech recognition error:", e);
        toast.error("Voice recognition failed.");
        setRecording(false);
      };
    } catch (e) {
      toast.error("Speech recognition failed to start.");
      setRecording(false);
    }
  };

  const handleSubmit = async (inputUrl = url) => {
    if (!isValidUrl(inputUrl)) {
      toast.error("Please enter a valid URL (http or https).", { autoClose: 3000 });
      return;
    }

    setLoading(true);
    setScreenshot(null);
    setSuggestions({});
    setSelectedTests([]);
    setReportUrl(null);

    try {
      const res = await fetch(`${API_BASE}/testaura/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });

      const data = await res.json().catch(() => {
        throw new Error("Invalid JSON response");
      });

      if (typeof data.suggestions === "object" && data.suggestions !== null) {
        setSuggestions(data.suggestions);
        const [firstCategory] = Object.keys(data.suggestions);
        const firstFew = data.suggestions[firstCategory]?.slice(0, 3).join(". ");
        if (firstFew) speak(`Here are some test suggestions. ${firstFew}`);
      } else {
        toast.warn("Unexpected AI response format.");
        setSuggestions({});
      }
    } catch (error) {
      console.error("❌ Error fetching suggestions:", error);
      toast.error("Failed to fetch test suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTest = (testText) => {
    setSelectedTests((prev) =>
      prev.includes(testText)
        ? prev.filter((t) => t !== testText)
        : [...prev, testText]
    );
  };

  const handleRunTests = async ({ username, password }) => {
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL (http or https).", { autoClose: 3000 });
      return;
    }

    if (selectedTests.length === 0) {
      toast.info("Please select at least one test to run.");
      return;
    }

    setIsRunning(true);
    setScreenshot(null);
    setReportUrl(null);

    try {
      // ✅ Add this log
      console.log("▶️ Running tests with:", {
        url,
        tests: selectedTests,
        username,
        password,
      });

      const res = await fetch(`${API_BASE}/testaura/run-smart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, tests: selectedTests, username, password }),
      });

      const data = await res.json().catch(() => {
        throw new Error("Invalid JSON response");
      });

      if (res.ok) {
        toast.success(data.message || "Tests executed.");
        if (data.screenshot) {
          setScreenshot(`data:image/png;base64,${data.screenshot}`);
        }
        if (data.reportUrl) {
          const cleanedUrl = data.reportUrl.replace(/^\/+/, "");
          setReportUrl(`${API_BASE}/${cleanedUrl}`);
        }
      } else {
        toast.error(data.message || "Test execution failed.");
      }
    } catch (error) {
      console.error("❌ Run error:", error);
      toast.error("Error communicating with backend.");
    } finally {
      setIsRunning(false);
    }
  };

  const downloadAsTxt = () => {
    if (!suggestions || Object.keys(suggestions).length === 0) {
      toast.warn("No suggestions to export.");
      return;
    }

    const content = Object.entries(suggestions)
      .map(
        ([category, tests]) =>
          `\n== ${category.toUpperCase()} ==\n` +
          tests.map((s, i) => `  ${i + 1}. ${s}`).join("\n")
      )
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "test-suggestions.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return {
    url,
    setUrl,
    suggestions,
    setSuggestions,
    selectedTests,
    setSelectedTests,
    loading,
    screenshot,
    isRunning,
    reportUrl,
    recording,
    transcript,
    setTranscript,
    setRecording,
    speak,
    handleSubmit,
    handleVoiceCommand,
    toggleTest,
    handleRunTests,
    downloadAsTxt,
    isValidUrl, // included for use in Preview component or others
  };
}
