from google import genai
from google.genai import types
import os

class GeminiLLMService:
  
  def __init__(self, model_name: str = "gemini-2.0-flash", temperature: float = 0.7):
    """
    Initialize the Gemini client.
    
    Args:
        model_name (str): The specific model version to use.
    """

    api_key = os.getenv("GOOGLE_GENAI_API_KEY")
    if not api_key:
        raise ValueError("API environment variable not set.")

    self.client = genai.Client(api_key=api_key)
    self.model_name = model_name
    self.temperature = temperature
    self.max_tokens = 1024

    # Configuration for text generation
    self.config = types.GenerateContentConfig(
      temperature=self.temperature,
      max_output_tokens=self.max_tokens # Optional
    )

  def list_models(self) -> list:
    """
    Lists available Gemini models.
    
    Returns:
        list: Available model names.
    """  
    try:
      models = self.client.models.list()
      return [model.name for model in models]
    except Exception as e:
      raise RuntimeError(f"Error listing models: {e}")
  
  def generate_content(self, prompt) -> str:
    """
    Generates a complete response for a given prompt (Blocking).
    
    Args:
        prompt (str): User input.
        temperature (float): Creativity control.
        
    Returns:
        str: The generated text.
    """  

    try:
      # Generate text using the Gemini model
      response: types.GenerateContentResponse = self.client.models.generate_content(
          model=self.model_name,
          contents=prompt,
          config=self.config
      )
    
    except Exception as e:
      raise RuntimeError(f"Error generating content: {e}")
    
    # Return the generated text
    return response.text
  
  def stream_content(self, prompt, temperature=0.7):
    """
    Streams the response for a given prompt (Non-Blocking).
    
    Args:
        prompt (str): User input.
        temperature (float): Creativity control.
    Yields:
        str: The generated text chunks.
    """  

    try:
      # Stream text using the Gemini model
      response_stream: types.GenerateContentStreamResponse = self.client.models.generate_content_stream(
          model=self.model_name,
          contents=[prompt],
          config=self.config
      )

      for chunk in response_stream:
          yield chunk.text

    except Exception as e:
      raise RuntimeError(f"Error streaming content: {e}")