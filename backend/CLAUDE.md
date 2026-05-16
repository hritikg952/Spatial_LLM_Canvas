# Backend — CLAUDE.md

## Stack

- **FastAPI** 0.115.6 — web framework
- **Uvicorn** — ASGI server
- **google-genai** 1.59.0 — Google Gemini SDK (only active LLM provider)
- **openai** 1.59.7 — installed but not wired up
- **Pydantic** v2 — request/response validation
- **python-dotenv** — `.env` loading

## Directory Layout

```
backend/
├── main.py                          # App entry: FastAPI init, CORS, router registration
├── requirements.txt
├── .env.example                     # API key template
├── test_api.py                      # Manual endpoint tests
└── routers/
    ├── __init__.py                  # Re-exports chat_router
    ├── chatRouter/
    │   ├── __init__.py
    │   └── chatRouter.py            # Route handlers
    ├── models/
    │   └── ChatModel.py             # ChatRequest, ChatResponse (Pydantic)
    └── services/
        └── GeminiLLMService.py      # Gemini API wrapper
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/chat/generate` | Generate LLM response (blocking or streaming) |
| `GET` | `/chat/models` | List available Gemini models |

### POST /chat/generate

Request body:
```json
{ "prompt": "your question", "stream": false }
```

Response:
```json
{ "content": "...", "model": "gemini-2.0-flash", "provider": "Gemini", "usage": {} }
```

Streaming (`"stream": true`) returns `text/event-stream` with newline-delimited `ChatResponse` JSON chunks.

## GeminiLLMService

`routers/services/GeminiLLMService.py`

- Reads `GOOGLE_GENAI_API_KEY` from environment.
- Default model: `gemini-2.0-flash`, temperature `0.7`, max tokens `1024`.
- `generate_content(prompt)` → blocking string response.
- `stream_content(prompt)` → generator yielding text chunks.
- `list_models()` → list of available model names from the API.

## ChatModel

`routers/models/ChatModel.py`

- `ChatRequest`: `prompt` (required str), `stream` (optional bool, default `False`).
- `ChatResponse`: `content`, `model`, `provider`, `usage` (dict).

## Environment Variables

```
GOOGLE_GENAI_API_KEY=   # Required — get from Google AI Studio
OPENAI_API_KEY=         # Optional — not currently used
```

Copy `.env.example` → `.env` and fill in values.

## Stale Documentation Warning

`ARCHITECTURE.md` and `ARCHITECTURE_DIAGRAM.md` describe an aspirational Strategy Pattern + Factory Pattern design (with `services/llm_service.py`, `LLMFactory`, `GeminiProvider`, `OpenAIProvider` classes) that **does not exist** in the actual code. The real code is simpler: a single `GeminiLLMService` class instantiated directly in the router. Do not rely on those files for code navigation.

## Known Issues / POC Gaps

- The router instantiates `GeminiLLMService` directly on every request (no DI/factory yet).
- OpenAI SDK is installed but no provider implementation exists.
- CORS allows all origins (`*`) — fine for local dev, must be restricted for production.
- `usage` field is estimated from word count, not real token data.
- Streaming serializes via deprecated `.json()` — should use `.model_dump_json()` in Pydantic v2.
