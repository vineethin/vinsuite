import { useState } from "react";
import { toast } from "react-toastify";

export default function TestAuraPanel() {
  const [url, setUrl] = useState("");
  const [suggestions, setSuggestions] = useState({});
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

      if (!res.ok) throw new Error("Failed to fetch suggestions.");

      const data = await res.json();
      if (typeof data.suggestions === "object") {
        setSuggestions(data.suggestions);
        const [firstCategory] = Object.keys(data.suggestions);
        const firstFew = data.suggestions[firstCategory]?.slice(0, 3).join(". ");
        if (firstFew) speak(`Here are some test suggestions. ${firstFew}`);
      } else {
        toast.warn("Unexpected response format.");
      }

      toast.success("Suggestions generated!");
    } catch (err) {
      toast.error("Error generating suggestions.");
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

  const isValidPreviewUrl = (inputUrl) => {
    try {
      const parsed = new URL(inputUrl);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
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
              <ul className="list-disc list-inside bg-gray-50 p-4 rounded space-y-2">
                {tests.map((s, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{s}</span>
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
        <div className="mt-6 border rounded overflow-hidden">
          <h4 className="font-medium mb-2">🔍 Webpage Preview</h4>
          <iframe
            src={url}
            title="URL Preview"
            className="w-full h-[400px] border"
          />
        </div>
      )}
    </div>
  );
}
