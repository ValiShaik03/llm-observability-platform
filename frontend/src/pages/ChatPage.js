import ReactMarkdown from "react-markdown";

export default function ChatPage({
  messages,
  loading,
  prompt,
  setPrompt,
  sendPrompt
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
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
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
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

      </div>

      {/* Input Area */}

      <div className="border-t border-slate-800 p-6">

        <div className="flex gap-4">

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={2}
            className="
              flex-1
              bg-slate-800
              text-white
              rounded-xl
              p-4
              resize-none
              outline-none
              border
              border-slate-700
              focus:border-blue-500
            "
          />

          <button
            onClick={sendPrompt}
            disabled={loading}
            className="
              bg-blue-600
              hover:bg-blue-700
              disabled:bg-slate-700
              px-8
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