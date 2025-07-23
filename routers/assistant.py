# routers/assistant.py

import os
import traceback
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

print("🔑 OPENROUTER_API_KEY:", OPENROUTER_API_KEY)

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

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
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "TeamSync Assistant"
    }

    body = {
        "model": "google/gemma-3n-e2b-it:free",   # ✅ Use this known working model first
        "messages": [
            {"role": "user", "content": payload.message}
        ]
    }

    try:
        print("📤 Sending to OpenRouter...")
        print("📤 Headers:", headers)
        print("📤 Body:", body)

        async with httpx.AsyncClient() as client:
            res = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=body
            )

        print("🔧 Status Code:", res.status_code)
        print("🔧 Response:", res.text)

        if res.status_code != 200:
            raise HTTPException(status_code=res.status_code, detail=f"OpenRouter Error: {res.text}")

        reply = res.json()["choices"][0]["message"]["content"].strip()
        return {"reply": reply}

    except Exception as e:
        print("❌ Exception:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")
