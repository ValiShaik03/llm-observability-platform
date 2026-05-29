import { useState } from "react";
import ReactMarkdown from "react-markdown";

function App() {

  const [prompt, setPrompt] = useState("");

  const [response, setResponse] = useState("");

  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {

    if (!prompt) return;

    setLoading(true);

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/chat?prompt=${prompt}`
      );

      const data = await res.json();

      setResponse(data.response);

    } catch (error) {

      setResponse("Error connecting to backend");

    }

    setLoading(false);
  };

  return (

    <div className="flex h-screen bg-gray-950 text-white">

      {/* SIDEBAR */}

      <div className="w-72 bg-gray-900 border-r border-gray-800 p-6">

        <h1 className="text-2xl font-bold mb-10">
          LLM Platform
        </h1>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold mb-8"
        >
          + New Chat
        </button>

        <div className="space-y-4">

          <div className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700">
            AI Observability
          </div>

          <div className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700">
            Prometheus Metrics
          </div>

          <div className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700">
            Langfuse Traces
          </div>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <div className="border-b border-gray-800 p-6 flex justify-between items-center">

          <h2 className="text-3xl font-bold">
            AI Assistant
          </h2>

          <div className="flex gap-4">

            <div className="bg-gray-900 px-4 py-2 rounded-lg">
              Requests: 24
            </div>

            <div className="bg-gray-900 px-4 py-2 rounded-lg">
              Latency: 420ms
            </div>

          </div>

        </div>

        {/* CHAT AREA */}

        <div className="flex-1 overflow-y-auto p-10">

          {/* USER MESSAGE */}

          {
            prompt && (

              <div className="flex justify-end mb-6">

                <div className="bg-blue-600 p-4 rounded-2xl max-w-2xl">
                  {prompt}
                </div>

              </div>

            )
          }

          {/* AI RESPONSE */}

          {
            response && (

              <div className="flex justify-start">

                <div className="bg-gray-800 p-6 rounded-2xl max-w-4xl leading-8 text-gray-200">

                  {
                    loading
                    ? (
                      <p className="text-blue-400">
                        Loading...
                      </p>
                    )
                    : (
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>
                          {response}
                        </ReactMarkdown>
                      </div>
                    )
                  }

                </div>

              </div>

            )
          }

        </div>

        {/* INPUT AREA */}

        <div className="border-t border-gray-800 p-6">

          <div className="flex gap-4">

            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-4 text-lg outline-none focus:border-blue-500"
            />

            <button
              onClick={sendPrompt}
              className="bg-blue-600 hover:bg-blue-700 px-8 rounded-xl font-semibold"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;