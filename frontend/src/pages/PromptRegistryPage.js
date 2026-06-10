import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PromptRegistryPage() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/prompt-template"
      );

      setTemplates(res.data);
    } catch (error) {
      console.error(
        "Failed to fetch templates",
        error
      );
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h1 className="text-5xl font-bold mb-10">
        Prompt Registry
      </h1>

      <div className="bg-slate-800 p-8 rounded-2xl">

        <h2 className="text-3xl font-bold mb-8">
          Registered Templates
        </h2>

        {templates.length === 0 ? (
          <p className="text-slate-400">
            No templates found
          </p>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="
                border-b
                border-slate-700
                pb-6
                mb-6
              "
            >

              <h3 className="text-2xl font-bold">
                {template.name}
              </h3>

              <div className="flex items-center gap-3 mt-2">

                <p className="text-slate-400">
                  Version: {template.version}
                </p>

                {template.is_active && (
                  <span
                    className="
                    bg-green-600
                    text-white
                    px-2
                    py-1
                    rounded-lg
                    text-xs
                    font-bold
                  "
                  >
                    ACTIVE
                  </span>
                )}

              </div>

              <p className="mt-4 text-lg">
                {template.template}
              </p>

              <p className="text-slate-500 mt-3">
                {new Date(
                  template.created_at
                ).toLocaleString()}
              </p>

            </div>
          ))
        )}

      </div>

    </div>
  );
}