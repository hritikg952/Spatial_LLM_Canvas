from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from ..services.GeminiLLMService import GeminiLLMService
from ..models.ChatModel import ChatRequest, ChatResponse


router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)


@router.post("/generate", response_model=ChatResponse)
async def generate_chat_response(request: ChatRequest):
    """
    Generate a chat response using the specified LLM provider.

    Args:
        request (ChatRequest): The chat request containing prompt and parameters.
    Returns:
        ChatResponse: The generated chat response.
    """
    try:
        promt = request.prompt
        stream = request.stream

        llm_service = GeminiLLMService()

        print(f"Generating response Stream: {stream}")
        if stream:
            # Streaming response
            def event_generator():
                for chunk in llm_service.stream_content(prompt=promt):
                    yield ChatResponse(
                        content=chunk,
                        model=llm_service.model_name,
                        provider="Gemini",
                        usage={"tokens_used": len(chunk.split())}  # Example usage data
                    ).json() + "\n"

            return StreamingResponse(event_generator(), media_type="text/event-stream")
        else:
            # Blocking response
            content = llm_service.generate_content(prompt=promt)
            response = ChatResponse(
                content=content,
                model=llm_service.model_name,
                provider="Gemini",
                usage={"tokens_used": len(content.split())}  # Example usage data
            )
            return response
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models")
async def get_models():
    """
    Get a list of available models.
    """
    try:
        llm_service = GeminiLLMService()
        models = llm_service.list_models()
        return {"models": models}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @router.post("/stream")
# async def stream_chat_response(request: ChatRequest):
#     """
#     Stream a chat response using the specified LLM provider.
    
#     Returns a Server-Sent Events (SSE) stream.
#     """
#     try:
#         pass
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
