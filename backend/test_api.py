"""
Test script to verify the modular LLM architecture implementation.
Run this after starting the server with: uvicorn main:app --reload
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_root():
    """Test the root endpoint."""
    print("Testing root endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"✅ Root: {response.json()}\n")

def test_get_providers():
    """Test getting available providers."""
    print("Testing /chat/providers endpoint...")
    response = requests.get(f"{BASE_URL}/chat/providers")
    print(f"✅ Available providers: {response.json()}\n")
    return response.json()["providers"]

def test_get_models(provider):
    """Test getting models for a provider."""
    print(f"Testing /chat/models/{provider} endpoint...")
    response = requests.get(f"{BASE_URL}/chat/models/{provider}")
    print(f"✅ Available models for {provider}: {response.json()}\n")
    return response.json()["models"]

def test_generate_response(provider, model):
    """Test generating a response."""
    print(f"Testing /chat/generate with {provider}/{model}...")
    
    payload = {
        "provider": provider,
        "model": model,
        "prompt": "Say 'Hello, World!' and nothing else.",
        "temperature": 0.7,
        "max_tokens": 50
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/chat/generate",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Response from {provider}:")
            print(f"   Content: {result['content'][:100]}...")
            print(f"   Model: {result['model']}")
            print(f"   Usage: {result['usage']}\n")
        else:
            print(f"❌ Error {response.status_code}: {response.text}\n")
    except Exception as e:
        print(f"❌ Exception: {str(e)}\n")

def main():
    """Run all tests."""
    print("=" * 60)
    print("Testing Modular LLM Architecture")
    print("=" * 60 + "\n")
    
    try:
        # Test root
        test_root()
        
        # Test providers
        providers = test_get_providers()
        
        # Test models for each provider
        for provider in providers:
            models = test_get_models(provider)
            
            # Test generation with first model (if API key is configured)
            if models:
                print(f"NOTE: The following test will fail if you haven't configured")
                print(f"      the {provider.upper()}_API_KEY in your .env file.\n")
                test_generate_response(provider, models[0])
        
        print("=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server.")
        print("   Make sure the server is running: uvicorn main:app --reload")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
