# Architecture Diagram

## Strategy Pattern + Dependency Injection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Request                          │
│  POST /chat/generate                                            │
│  {                                                              │
│    "provider": "gemini",                                        │
│    "model": "gemini-2.0-flash-exp",                            │
│    "prompt": "Hello!"                                           │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ChatRouter (API Layer)                       │
│  - Receives request                                             │
│  - Depends ONLY on LLMService abstraction                       │
│  - Does NOT know about concrete providers                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Calls factory
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LLMFactory                                 │
│  - Factory Pattern implementation                               │
│  - Maps provider name → Provider class                          │
│  - Creates and returns LLMService instance                      │
│                                                                 │
│  _providers = {                                                 │
│    "gemini": GeminiProvider,                                    │
│    "openai": OpenAIProvider,                                    │
│    "claude": ClaudeProvider,  ← Easy to add!                    │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Returns instance
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LLMService (ABC)                             │
│  Abstract Base Class - defines the contract                     │
│                                                                 │
│  @abstractmethod                                                │
│  async def generate_response(...)                               │
│                                                                 │
│  @abstractmethod                                                │
│  async def stream_response(...)                                 │
│                                                                 │
│  @abstractmethod                                                │
│  def get_available_models(...)                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Implemented by
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Concrete Provider Implementations                  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Gemini     │  │   OpenAI     │  │   Claude     │          │
│  │   Provider   │  │   Provider   │  │   Provider   │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ - Uses       │  │ - Uses       │  │ - Uses       │          │
│  │   Google AI  │  │   OpenAI     │  │   Anthropic  │          │
│  │   SDK        │  │   SDK        │  │   SDK        │          │
│  │              │  │              │  │              │          │
│  │ - Implements │  │ - Implements │  │ - Implements │          │
│  │   all        │  │   all        │  │   all        │          │
│  │   abstract   │  │   abstract   │  │   abstract   │          │
│  │   methods    │  │   methods    │  │   methods    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                         │
                         │ Makes API call
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External LLM APIs                            │
│  - Google Gemini API                                            │
│  - OpenAI API                                                   │
│  - Anthropic Claude API                                         │
└─────────────────────────────────────────────────────────────────┘
```

## Key Benefits Illustrated

### 1. Loose Coupling
```
Router → LLMService (abstraction)
         ↑
         │ NOT directly coupled to:
         │
         ├─ GeminiProvider
         ├─ OpenAIProvider
         └─ ClaudeProvider
```

### 2. Easy Extension (Open/Closed Principle)
```
To add new provider:
1. Create new class: ClaudeProvider(LLMService)
2. Register in factory: _providers["claude"] = ClaudeProvider
3. Done! ✅

NO changes needed in:
❌ Router code
❌ Request/response models
❌ Business logic
```

### 3. Runtime Provider Selection
```
Request A → provider: "gemini"  → GeminiProvider instance
Request B → provider: "openai"  → OpenAIProvider instance
Request C → provider: "claude"  → ClaudeProvider instance
```

## Design Patterns Applied

### Strategy Pattern
- **Context**: ChatRouter
- **Strategy Interface**: LLMService (ABC)
- **Concrete Strategies**: GeminiProvider, OpenAIProvider, ClaudeProvider
- **Benefit**: Algorithm (LLM provider) can be selected at runtime

### Factory Pattern
- **Factory**: LLMFactory
- **Products**: Provider instances (GeminiProvider, OpenAIProvider, etc.)
- **Benefit**: Centralized object creation logic

### Dependency Injection
- **Injector**: LLMFactory.create()
- **Dependency**: LLMService instance
- **Consumer**: ChatRouter endpoints
- **Benefit**: Decouples creation from usage

## Code Flow Example

```python
# 1. Client sends request
POST /chat/generate
{
  "provider": "gemini",
  "model": "gemini-2.0-flash-exp",
  "prompt": "Hello!"
}

# 2. Router receives request
@router.post("/generate")
async def generate_chat_response(request: ChatRequest):
    # 3. Factory creates provider instance
    llm_service: LLMService = LLMFactory.create("gemini")
    # Returns: GeminiProvider instance
    
    # 4. Router calls abstraction method
    response = await llm_service.generate_response(
        prompt="Hello!",
        model="gemini-2.0-flash-exp"
    )
    # GeminiProvider.generate_response() is called
    
    # 5. Return response
    return ChatResponse(...)
```

## Adding a New Provider - Step by Step

```python
# Step 1: Create provider class
# File: services/claude_provider.py
from services.llm_service import LLMService
from anthropic import AsyncAnthropic

class ClaudeProvider(LLMService):
    def __init__(self, api_key=None):
        self.client = AsyncAnthropic(api_key=api_key)
    
    async def generate_response(self, prompt, model, **kwargs):
        response = await self.client.messages.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        return {
            "content": response.content[0].text,
            "model": model,
            "usage": {...},
            "metadata": {"provider": "claude"}
        }
    
    async def stream_response(self, prompt, model, **kwargs):
        # Implement streaming
        ...
    
    def get_available_models(self):
        return ["claude-3-5-sonnet-20241022", ...]

# Step 2: Register in factory
# File: services/llm_factory.py
from .claude_provider import ClaudeProvider

class LLMFactory:
    _providers = {
        "gemini": GeminiProvider,
        "openai": OpenAIProvider,
        "claude": ClaudeProvider,  # ← Add this line
    }

# Step 3: That's it! Router automatically supports it
# No changes to router code needed!
```

## Testing the Architecture

```bash
# Test 1: Get available providers
curl http://localhost:8000/chat/providers
# Response: {"providers": ["gemini", "openai", "claude"]}

# Test 2: Get models for a provider
curl http://localhost:8000/chat/models/gemini

# Test 3: Generate with Gemini
curl -X POST http://localhost:8000/chat/generate \
  -H "Content-Type: application/json" \
  -d '{"provider": "gemini", "model": "gemini-2.0-flash-exp", "prompt": "Hi!"}'

# Test 4: Generate with OpenAI
curl -X POST http://localhost:8000/chat/generate \
  -H "Content-Type: application/json" \
  -d '{"provider": "openai", "model": "gpt-4o-mini", "prompt": "Hi!"}'

# Test 5: Generate with Claude (after adding it)
curl -X POST http://localhost:8000/chat/generate \
  -H "Content-Type: application/json" \
  -d '{"provider": "claude", "model": "claude-3-5-sonnet-20241022", "prompt": "Hi!"}'
```
