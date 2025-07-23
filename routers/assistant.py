# routers/assistant.py

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
print("🔑 Loaded API key:", OPENROUTER_API_KEY)

router = APIRouter(prefix="/ai", tags=["Assistant"])

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(payload: ChatRequest):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=503, detail="Missing OpenRouter API key")

    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message is empty")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "TeamSync Assistant",
        "Content-Type": "application/json"
    }

    body = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {"role": "user", "content": payload.message}
        ]
    }

    try:
        print("📤 Request Headers:", headers)
        print("📤 Request Body:", body)

        async with httpx.AsyncClient() as client:
            res = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body)

        print("🔧 OpenRouter Status Code:", res.status_code)
        print("🔧 OpenRouter Response:", res.text)

        if res.status_code != 200:
            raise HTTPException(status_code=res.status_code, detail=f"OpenRouter Error: {res.text}")

        data = res.json()
        reply = data["choices"][0]["message"]["content"].strip()
        return {"reply": reply}

    except Exception as e:
        import traceback
        print("❌ Full Exception Traceback:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")
