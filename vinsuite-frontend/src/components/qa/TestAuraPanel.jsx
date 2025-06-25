import { useState } from "react";
import { toast } from "react-toastify";

export default function TestAuraPanel() {
  const [url, setUrl] = useState("");
  const [suggestions, setSuggestions] = useState({});
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);

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

  const generateSuggestions = async () => {
    if (!url.trim()) {
      toast.warn("Please enter a URL.");
      return;
    }

    try {
      const res = await fetch("/api/testaura/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        toast.error("Failed to parse AI response (invalid JSON).");
        return;
      }

      if (!res.ok || data.error) {
        toast.error(`AI Error: ${data.error || "Unknown issue occurred."}`);
        return;
      }

      if (typeof data.suggestions === "object" && data.suggestions !== null) {
        setSuggestions(data.suggestions);
        const [firstCategory] = Object.keys(data.suggestions);
        const firstFew = data.suggestions[firstCategory]?.slice(0, 3).join(". ");
        if (firstFew) speak(`Here are some test suggestions. ${firstFew}`);
        toast.success("Suggestions generated!");
      } else {
        toast.warn("Unexpected AI response format.");
        setSuggestions({});
      }
    } catch (err) {
      toast.error("Network or server error occurred.");
      console.error(err);
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
        generateSuggestions();
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

  const handleRunTests = async () => {
    if (!url || selectedTests.length === 0) {
      toast.warn("Please enter a valid URL and select at least one test.");
      return;
    }

    try {
      const res = await fetch("/api/testaura/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, tests: selectedTests }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(`Run failed: ${data.message || "Server error."}`);
      } else {
        toast.success(data.message || "Test run started!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error communicating with backend.");
    }
  };

  const isValidPreviewUrl = (inputUrl) => {
    try {
      const parsed = new URL(inputUrl);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const toggleTestSelection = (testText) => {
    setSelectedTests((prev) =>
      prev.includes(testText)
        ? prev.filter((t) => t !== testText)
        : [...prev, testText]
    );
  };

  return (
    <div className="space-y-4 p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold">🎤 TestAura – Voice QA Assistant</h2>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to test (e.g. https://example.com)"
        className="w-full p-2 border rounded"
      />

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={generateSuggestions}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Get Test Suggestions
        </button>

        <button
          onClick={handleVoiceCommand}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          🎙️ {recording ? "Listening..." : "Speak Command"}
        </button>

        <button
          onClick={downloadAsTxt}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          📥 Export as TXT
        </button>
      </div>

      {transcript && (
        <p className="italic text-gray-600">You said: “{transcript}”</p>
      )}

      {Object.keys(suggestions).length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="font-semibold">📋 Suggested Tests (Grouped):</h3>
          {Object.entries(suggestions).map(([category, tests]) => (
            <div key={category}>
              <h4 className="text-md font-bold text-blue-800 mb-2">
                🗂️ {category}
              </h4>
              <ul className="list-none bg-gray-50 p-4 rounded space-y-2">
                {tests.map((s, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(s)}
                        onChange={() => toggleTestSelection(s)}
                      />
                      <span>{s}</span>
                    </label>
                    <button
                      className="text-sm text-blue-600 underline ml-2"
                      onClick={() => speak(s)}
                    >
                      🔊 Listen
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {isValidPreviewUrl(url) && (
        <>
          <div className="mt-6 border rounded overflow-hidden">
            <h4 className="font-medium mb-2">🔍 Webpage Preview</h4>
            <iframe
              src={url}
              title="URL Preview"
              className="w-full h-[400px] border"
            />
          </div>

          <div className="mt-4">
            <button
              onClick={handleRunTests}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              🧪 Run Selected Tests
            </button>
          </div>
        </>
      )}
    </div>
  );
}
