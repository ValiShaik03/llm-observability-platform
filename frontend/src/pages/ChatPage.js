import ReactMarkdown from "react-markdown";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
export default function ChatPage({
  messages,
  loading,
  prompt,
  setPrompt,
  sendPrompt,
  setToast
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const [model, setModel] = useState("groq");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] =
  useState("Summarizer");
  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

useEffect(() => {

  axios
    .get("http://localhost:8000/templates")
    .then((res) => {

      setTemplates(res.data);

    })
    .catch(console.error);

}, []);
  const handleKeyDown = (e) => {

  if (
    e.key === "Enter" &&
    !e.shiftKey
  ) {

    e.preventDefault();

    console.log(
      "Selected Template:",
      selectedTemplate
    );

    sendPrompt(
      model,
      selectedTemplate
    );

  }

};
  

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">

      {/* Messages Area */}

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">

        {messages.length === 0 && (
          <div className="text-center mt-20">
            <h2 className="text-4xl font-bold mb-4">
              Welcome to LLM Observability Platform
            </h2>

            <p className="text-slate-400">
              Start a conversation with your AI assistant.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-3xl px-5 py-4 rounded-2xl ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-100"
              }`}
            >
              {msg.role === "assistant" ? (
  <>
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown>
        {msg.content}
      </ReactMarkdown>
    </div>

    <div className="flex justify-end mt-3">
  <button
    onClick={() => {
      navigator.clipboard.writeText(msg.content);

      setCopiedIndex(index);
      setToast("✅ Response copied")
      setTimeout(() => {
        setCopiedIndex(null);
        setToast("");
      }, 2000);
    }}
    className="
      text-sm
      bg-slate-700
      hover:bg-slate-600
      px-3
      py-1
      rounded-lg
    "
  >
    {copiedIndex === index
      ? "✅ Copied"
      : "📋 Copy"}
  </button>
</div>
  </>
) : (
  <p>{msg.content}</p>
)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-5 py-4 rounded-2xl">
              <div className="animate-pulse">
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />

      </div>

{/* Input Area */}

<div className="border-t border-slate-800 p-6">

  <div className="flex gap-4 items-center">

    {/* Model Dropdown */}

    <select
      value={model}
      onChange={(e) => setModel(e.target.value)}
      className="
        h-16
        bg-slate-800
        text-white
        border
        border-slate-700
        rounded-xl
        px-4
      "
    >
      <option value="groq">Groq</option>
      <option value="gemini">Gemini</option>
      <option value="ollama">Ollama</option>
    </select>

    {/* Template Dropdown */}

    <select
      value={selectedTemplate}
      onChange={(e) =>
        setSelectedTemplate(
          e.target.value
        )
      }
      className="
        h-16
        bg-slate-800
        text-white
        border
        border-slate-700
        rounded-xl
        px-4
      "
    >
      {templates.map((template) => (

  <option
    key={`${template.name}-${template.version}`}
    value={`${template.name}|${template.version}`}
  >

    {template.name} ({template.version})

  </option>

))}
    </select>

    {/* Prompt Input */}

    <textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Ask anything..."
      rows={1}
      className="
        flex-1
        h-16
        bg-slate-800
        text-white
        rounded-xl
        px-4
        py-4
        resize-none
        outline-none
        border
        border-slate-700
        focus:border-blue-500
      "
    />

    {/* Send Button */}

    <button
      onClick={() =>
        sendPrompt(
          model,
          selectedTemplate
        )
      }
      disabled={loading}
      className="
        h-16
        min-w-[120px]
        bg-blue-600
        hover:bg-blue-700
        disabled:bg-slate-700
        rounded-xl
        font-semibold
      "
    >
      Send
    </button>

  </div>

</div>

    </div>
  );
}