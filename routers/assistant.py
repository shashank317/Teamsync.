from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os

from auth import get_current_user  # JWT authentication

# Load environment variables
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY not set in .env")

# Initialize OpenAI client with OpenRouter backend
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY
)

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/ai/chat")
async def chat_with_ai(payload: ChatRequest, user=Depends(get_current_user)):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        completion = client.chat.completions.create(
            model="moonshotai/kimi-k2:free",  # ✅ Using Kimi K2 Free
            messages=[
                {"role": "system", "content": "You are a helpful assistant for a team collaboration app."},
                {"role": "user", "content": payload.message}
            ],
            extra_headers={
                "HTTP-Referer": "https://teamsync.ai",
                "X-Title": "TeamSync Assistant"
            }
        )
        reply = completion.choices[0].message.content.strip()
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail="AI assistant error: " + str(e))
