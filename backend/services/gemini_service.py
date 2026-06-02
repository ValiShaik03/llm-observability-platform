import os
from google import genai

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_response(prompt):

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return {
    "text": response.text,
    "prompt_tokens": response.usage_metadata.prompt_token_count,
    "completion_tokens": response.usage_metadata.candidates_token_count,
    "total_tokens": response.usage_metadata.total_token_count
}