import os
from dotenv import load_dotenv
load_dotenv()
print("Key:", os.getenv("OPENROUTER_API_KEY"))
print("🔑 Token payload user_id:", user_id)
print("🔍 DB returned user:", user)
