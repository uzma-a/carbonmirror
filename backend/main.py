from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx, json, os, re

load_dotenv(".env")
load_dotenv(".env.example")

app = FastAPI(title="CarbonMirror API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:3000","https://your-domain.com"],
    allow_methods=["POST","GET"],
    allow_headers=["*"],
)

GEMMA_API_KEY = os.getenv("GEMMA_API_KEY", "YOUR_GEMMA_API_KEY_HERE")
# gemma-3-12b-it: fast enough to avoid timeouts, still high quality
GEMMA_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-12b-it:generateContent"

class UserInput(BaseModel):
    city: str
    transport: str
    diet: str
    electricity: str
    ac_usage: str
    flights: str

def build_messages(data: UserInput) -> list:
    user_msg = f"""You are a climate AI. Given a user's lifestyle, return a JSON object simulating their climate future.

User profile:
- City: {data.city}
- Transport: {data.transport}
- Diet: {data.diet}
- Electricity: {data.electricity}
- AC usage: {data.ac_usage}
- Flights/year: {data.flights}

Respond with ONLY this JSON (no extra text, no markdown):
{{
  "profile": {{
    "lifestyle_summary": "2-3 sentences to 'you' summarizing their emission lifestyle",
    "top_emission_sources": ["source1", "source2", "source3"],
    "risk_factors": ["city-specific risk1", "risk2", "risk3"]
  }},
  "future_current_path": {{
    "title": "Dramatic 2040 title if no change (max 8 words)",
    "narrative": "3-4 sentences to 'you' about daily life in {data.city} in 2040 with no changes. Be vivid.",
    "key_impacts": ["impact1", "impact2", "impact3", "impact4"]
  }},
  "future_improved_path": {{
    "title": "Hopeful 2040 title if user acts (max 8 words)",
    "narrative": "3-4 sentences to 'you' about improved life in {data.city} in 2040 after changes. Be hopeful.",
    "benefits": ["benefit1", "benefit2", "benefit3", "benefit4"]
  }},
  "recommended_actions": [
    {{"action": "Action specific to this user", "impact_level": "High", "difficulty": "Medium", "reason": "Why it matters in {data.city}"}},
    {{"action": "Action specific to this user", "impact_level": "High", "difficulty": "Easy", "reason": "Why it matters in {data.city}"}},
    {{"action": "Action specific to this user", "impact_level": "Medium", "difficulty": "Easy", "reason": "Why it matters in {data.city}"}}
  ]
}}"""

    return [
        {"role": "user",  "parts": [{"text": user_msg}]},
        {"role": "model", "parts": [{"text": "{"}]},  # prime JSON output
    ]

def extract_json(raw: str) -> dict:
    # Model was primed with "{" so add it back
    raw = "{" + raw
    cleaned = re.sub(r"```(?:json)?|```", "", raw).strip()

    # Try direct parse
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Find outermost { ... }
    start = cleaned.find('{')
    end   = cleaned.rfind('}')
    if start != -1 and end > start:
        try:
            return json.loads(cleaned[start:end+1])
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=502, detail=f"JSON parse failed: {e} | Raw: {cleaned[:400]}")

    raise HTTPException(status_code=502, detail=f"No JSON found. Raw: {raw[:400]}")

async def call_gemma(data: UserInput) -> dict:
    payload = {
        "contents": build_messages(data),
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 2048,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{GEMMA_API_URL}?key={GEMMA_API_KEY}",
                json=payload,
                headers={"Content-Type": "application/json"},
            )
    except httpx.ReadTimeout:
        raise HTTPException(status_code=504, detail="Model timed out. Please try again.")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Network error: {e}")

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"API error {resp.status_code}: {resp.text[:400]}")

    body = resp.json()
    try:
        raw_text = body["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError) as e:
        raise HTTPException(status_code=502, detail=f"Bad response shape: {str(body)[:300]}")

    return extract_json(raw_text)


@app.get("/")
def health():
    return {"status": "CarbonMirror API running", "model": "gemma-3-12b-it"}


@app.post("/analyze")
async def analyze(user_input: UserInput):
    if GEMMA_API_KEY == "YOUR_GEMMA_API_KEY_HERE":
        raise HTTPException(status_code=500, detail="Set GEMMA_API_KEY environment variable")
    return await call_gemma(user_input)