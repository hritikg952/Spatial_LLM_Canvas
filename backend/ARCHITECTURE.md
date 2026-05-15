# Modular LLM Architecture - Implementation Guide

## Architecture Overview

This implementation uses the **Strategy Pattern** and **Dependency Injection** to create a modular, extensible LLM architecture.

### Key Components

1. **LLMService (Abstract Base Class)** - `services/llm_service.py`
   - Defines the interface that all providers must implement
   - Methods: `generate_response()`, `stream_response()`, `get_available_models()`

2. **Concrete Providers** - `services/`
   - `GeminiProvider` - Google Gemini implementation
   - `OpenAIProvider` - OpenAI implementation
   - Each inherits from `LLMService` and implements all abstract methods

3. **LLMFactory** - `services/llm_factory.py`
   - Factory Pattern for creating provider instances
   - Maintains a registry of available providers
   - Provides dependency injection function for FastAPI

4. **Chat Router** - `routers/chatRouter/chatRouter.py`
   - Depends only on the `LLMService` abstraction
   - Uses factory to get the appropriate provider at runtime
   - **No changes needed when adding new providers!**

## Benefits

✅ **Loose Coupling**: Router depends on abstraction, not concrete implementations
✅ **Open/Closed Principle**: Open for extension, closed for modification
✅ **Easy Testing**: Can mock the LLMService interface
✅ **Runtime Provider Selection**: Choose provider based on user input or config
✅ **Future-Proof**: Add new providers without touching router code

## Adding a New Provider

To add a new provider (e.g., Claude, Cohere, etc.):

### Step 1: Create Provider Class

```python
# services/claude_provider.py
from services.llm_service import LLMService

class ClaudeProvider(LLMService):
    def __init__(self, api_key: Optional[str] = None):
        # Initialize Claude client
        pass
    
    async def generate_response(self, prompt, model, **kwargs):
        # Implement using Claude SDK
        pass
    
    async def stream_response(self, prompt, model, **kwargs):
        # Implement streaming
        pass
    
    def get_available_models(self):
        return ["claude-3-5-sonnet-20241022", ...]
```

### Step 2: Register in Factory

```python
# services/llm_factory.py
from .claude_provider import ClaudeProvider

class LLMFactory:
    _providers = {
        "gemini": GeminiProvider,
        "openai": OpenAIProvider,
        "claude": ClaudeProvider,  # <-- Add this line
    }
```

### Step 3: That's it! 🎉

The router automatically supports the new provider. No changes needed to:
- Router endpoints
- Request/response models
- Business logic

## API Endpoints

### POST `/chat/generate`
Generate a complete response.

**Request:**
```json
{
  "provider": "gemini",
  "model": "gemini-2.0-flash-exp",
  "prompt": "Explain quantum computing",
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**Response:**
```json
{
  "content": "Quantum computing is...",
  "model": "gemini-2.0-flash-exp",
  "provider": "gemini",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 150,
    "total_tokens": 160
  }
}
```

### POST `/chat/stream`
Stream a response using Server-Sent Events (SSE).

**Request:** Same as `/chat/generate`

**Response:** SSE stream
```
data: {"content": "Quantum", "model": "...", "metadata": {...}}

data: {"content": " computing", "model": "...", "metadata": {...}}

data: [DONE]
```

### GET `/chat/providers`
Get list of available providers.

**Response:**
```json
{
  "providers": ["gemini", "openai"]
}
```

### GET `/chat/models/{provider}`
Get available models for a provider.

**Response:**
```json
{
  "provider": "gemini",
  "models": ["gemini-2.0-flash-exp", "gemini-1.5-pro", ...]
}
```

## Environment Variables

Create a `.env` file:

```env
GOOGLE_API_KEY=your_google_api_key
OPENAI_API_KEY=your_openai_api_key
```

## Dependencies

```bash
pip install fastapi uvicorn python-dotenv
pip install google-generativeai  # For Gemini
pip install openai              # For OpenAI
```

## Running the Server

```bash
cd backend
uvicorn main:app --reload
```

## Testing with cURL

```bash
# Generate response
curl -X POST http://localhost:8000/chat/generate \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "gemini",
    "model": "gemini-2.0-flash-exp",
    "prompt": "Hello, world!"
  }'

# Get providers
curl http://localhost:8000/chat/providers

# Get models
curl http://localhost:8000/chat/models/gemini
```

## Design Patterns Used

1. **Strategy Pattern**: Different LLM providers are different strategies
2. **Factory Pattern**: LLMFactory creates the appropriate provider
3. **Dependency Injection**: Router receives LLMService through factory
4. **Abstract Base Class**: LLMService defines the contract

## File Structure

```
backend/
├── main.py                          # FastAPI app
├── services/
│   ├── __init__.py
│   ├── llm_service.py              # Abstract base class
│   ├── gemini_provider.py          # Gemini implementation
│   ├── openai_provider.py          # OpenAI implementation
│   ├── llm_factory.py              # Factory + DI
│   └── claude_provider_example.py  # Example for adding providers
└── routers/
    └── chatRouter/
        ├── __init__.py
        └── chatRouter.py           # API endpoints (provider-agnostic!)
```
