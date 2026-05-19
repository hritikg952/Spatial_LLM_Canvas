# Spatial LLM Canvas — Backend

FastAPI service that exposes LLM-powered chat endpoints. Currently uses Google Gemini as the only active provider.

## Prerequisites

- Python 3.10+
- A [Google AI Studio](https://aistudio.google.com/) API key

## Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

Copy the environment template and add your API key:

```bash
cp .env.example .env
# Edit .env and set GOOGLE_GENAI_API_KEY=<your key>
```

## Run

```bash
uvicorn main:app --reload
```

Server starts at `http://localhost:8000`.

Interactive API docs: `http://localhost:8000/docs`

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/chat/generate` | Generate a response from Gemini |
| `GET` | `/chat/models` | List available Gemini models |

### Generate a response

```bash
curl -X POST http://localhost:8000/chat/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain recursion in one sentence."}'
```

Response:
```json
{
  "content": "...",
  "model": "gemini-2.0-flash",
  "provider": "Gemini",
  "usage": {}
}
```

### Streaming

Pass `"stream": true` in the request body to receive a `text/event-stream` response with newline-delimited JSON chunks.

## Project Structure

```
backend/
├── main.py                          # App entry: FastAPI init, CORS, router mount
├── requirements.txt
├── .env.example                     # Environment variable template
├── test_api.py                      # Manual smoke tests for all endpoints
└── routers/
    ├── __init__.py
    ├── chatRouter/
    │   └── chatRouter.py            # /chat route handlers
    ├── models/
    │   └── ChatModel.py             # Pydantic request/response models
    └── services/
        └── GeminiLLMService.py      # Google Gemini API wrapper
```

## Current State (POC)

- Only Google Gemini is implemented. `openai` is installed as a dependency but has no provider class.
- CORS is open to all origins (`*`) — restrict this before any public deployment.
- Token usage in responses is estimated from word count, not actual API token data.
- There is no authentication or rate limiting.
