import requests

def generate_response(prompt):

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "tinyllama",
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()

    if "error" in data:
        raise Exception(
            f"Ollama Error: {data['error']}"
        )

    return {
    "text": data["response"],
    "prompt_tokens": data.get("prompt_eval_count", 0),
    "completion_tokens": data.get("eval_count", 0),
    "total_tokens":
        data.get("prompt_eval_count", 0)
        + data.get("eval_count", 0)
}