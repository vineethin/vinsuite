import { useState } from "react";

export default function TestAuraPanel() {
  const [url, setUrl] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const generateSuggestions = async () => {
    const res = await fetch("/api/testaura/suggestions", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setSuggestions(data.suggestions);
  };

  const handleVoiceCommand = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setRecording(true);

    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      setTranscript(speech);
      setRecording(false);
    };

    recognition.onerror = () => setRecording(false);
  };

  return (
    <div className="space-y-4 p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold">🎤 TestAura – Voice QA Assistant</h2>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to test (e.g. https://example.com)"
        className="w-full p-2 border rounded"
      />

      <button
        onClick={generateSuggestions}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Get Test Suggestions
      </button>

      {suggestions.length > 0 && (
        <div>
          <h3 className="font-semibold mt-4">📋 Suggested Tests:</h3>
          <ul className="list-decimal list-inside">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleVoiceCommand}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        🎙️ {recording ? "Listening..." : "Speak Command"}
      </button>

      {transcript && (
        <p className="italic text-gray-600">You said: “{transcript}”</p>
      )}
    </div>
  );
}
