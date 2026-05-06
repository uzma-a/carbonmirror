from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx, json, os, re

load_dotenv(".env")

app = FastAPI(title="CarbonMirror API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

HF_TOKEN = os.getenv("HF_TOKEN", "YOUR_HF_TOKEN_HERE")
HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
MODEL = "google/gemma-4-31B-it:deepinfra"

class UserInput(BaseModel):
    city: str
    transport: str
    diet: str
    electricity: str
    ac_usage: str
    flights: str

# ── Carbon Score Calculator ──────────────────────────────────
def calculate_carbon_score(data: UserInput) -> dict:
    TRANSPORT_SCORES = {
        "personal car (daily)": 2,
        "motorcycle (daily)": 5,
        "mix of car and public transit": 12,
        "ride-sharing services": 14,
        "public transport (daily)": 20,
        "mostly walking or cycling": 25,
    }
    DIET_SCORES = {
        "heavy meat-eater (daily beef/lamb)": 2,
        "regular meat-eater (chicken/pork daily)": 8,
        "flexitarian (meat 2–3x/week)": 15,
        "vegetarian": 20,
        "vegan": 25,
    }
    ELECTRICITY_SCORES = {
        "very high (above 500 units/month)": 2,
        "high (300–500 units/month)": 6,
        "moderate (150–300 units/month)": 10,
        "low (under 150 units/month)": 15,
    }
    AC_SCORES = {
        "heavy (18+ hours/day in summer)": 2,
        "moderate (8–12 hours/day in summer)": 6,
        "occasional (nights or peak hours only)": 10,
        "rarely or no AC": 15,
    }
    FLIGHTS_SCORES = {
        "more than 6 flights per year": 2,
        "3–6 flights per year": 8,
        "1–2 flights per year": 14,
        "no flights": 20,
    }
    t = TRANSPORT_SCORES.get(data.transport, 10)
    d = DIET_SCORES.get(data.diet, 10)
    e = ELECTRICITY_SCORES.get(data.electricity, 8)
    a = AC_SCORES.get(data.ac_usage, 8)
    f = FLIGHTS_SCORES.get(data.flights, 10)
    total = t + d + e + a + f

    def grade(score):
        if score >= 80: return "Excellent"
        if score >= 60: return "Good"
        if score >= 40: return "Fair"
        if score >= 20: return "Poor"
        return "Critical"

    return {
        "total": total,
        "max": 100,
        "grade": grade(total),
        "breakdown": {
            "transport":   {"score": t, "max": 25, "label": "Transport"},
            "diet":        {"score": d, "max": 25, "label": "Diet"},
            "electricity": {"score": e, "max": 15, "label": "Electricity"},
            "ac_usage":    {"score": a, "max": 15, "label": "AC Usage"},
            "flights":     {"score": f, "max": 20, "label": "Flights"},
        },
        "improved_total": min(100, int(total * 1.4)),
    }

# ── Prompt Builder ────────────────────────────────────────────
def build_prompt(data: UserInput) -> str:
    return f"""You are a climate AI. Return ONLY valid JSON, no extra text, no markdown.

User lifestyle:
- City: {data.city}
- Transport: {data.transport}
- Diet: {data.diet}
- Electricity: {data.electricity}
- AC usage: {data.ac_usage}
- Flights/year: {data.flights}

Return this exact JSON:
{{
  "profile": {{
    "lifestyle_summary": "2-3 sentences speaking directly to you about emissions",
    "top_emission_sources": ["source1", "source2", "source3"],
    "risk_factors": ["risk specific to {data.city}", "risk2", "risk3"]
  }},
  "future_current_path": {{
    "title": "Dramatic 2040 title if nothing changes (max 8 words)",
    "narrative": "3-4 vivid sentences to you about daily life in {data.city} in 2040 if no change",
    "key_impacts": ["impact1", "impact2", "impact3", "impact4"]
  }},
  "future_improved_path": {{
    "title": "Hopeful 2040 title if user makes changes (max 8 words)",
    "narrative": "3-4 hopeful sentences to you about improved life in {data.city} in 2040",
    "benefits": ["benefit1", "benefit2", "benefit3", "benefit4"]
  }},
  "recommended_actions": [
    {{"action": "specific action for this user", "impact_level": "High", "difficulty": "Medium", "reason": "why this matters in {data.city}"}},
    {{"action": "specific action for this user", "impact_level": "High", "difficulty": "Easy", "reason": "why this matters in {data.city}"}},
    {{"action": "specific action for this user", "impact_level": "Medium", "difficulty": "Easy", "reason": "why this matters in {data.city}"}}
  ]
}}"""

# ── JSON Extractor ────────────────────────────────────────────
def extract_json(raw: str) -> dict:
    cleaned = re.sub(r"```(?:json)?|```", "", raw).strip()
    cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', ' ', cleaned)

    def fix_strings(m):
        return m.group(0).replace('\n', ' ').replace('\r', ' ').replace('\t', ' ')
    cleaned = re.sub(r'"[^"\\]*(?:\\.[^"\\]*)*"', fix_strings, cleaned, flags=re.DOTALL)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    start = cleaned.find('{')
    end   = cleaned.rfind('}')
    if start != -1 and end > start:
        chunk = cleaned[start:end+1]
        chunk = re.sub(r'"[^"\\]*(?:\\.[^"\\]*)*"', fix_strings, chunk, flags=re.DOTALL)
        try:
            return json.loads(chunk)
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=502, detail=f"JSON parse failed: {e} | Raw: {chunk[:400]}")

    raise HTTPException(status_code=502, detail=f"No JSON found. Raw: {raw[:400]}")

# ── Gemma API Call ────────────────────────────────────────────
async def call_gemma(data: UserInput) -> dict:
    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": build_prompt(data)}],
        "max_tokens": 2048,
        "temperature": 0.7,
        "stream": False
    }

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                HF_API_URL,
                json=payload,
                headers={
                    "Authorization": f"Bearer {HF_TOKEN}",
                    "Content-Type": "application/json"
                }
            )
    except httpx.ReadTimeout:
        raise HTTPException(status_code=504, detail="Model timed out. Please try again.")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Network error: {e}")

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"HF API error {resp.status_code}: {resp.text[:400]}")

    body = resp.json()
    try:
        raw_text = body["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        raise HTTPException(status_code=502, detail=f"Bad response: {str(body)[:300]}")

    return extract_json(raw_text)

# ── Routes ────────────────────────────────────────────────────
@app.get("/")
def health():
    return {"status": "CarbonMirror API running", "model": "gemma-4-31B-it (HuggingFace Router)"}

@app.post("/analyze")
async def analyze(user_input: UserInput):
    if HF_TOKEN == "YOUR_HF_TOKEN_HERE":
        raise HTTPException(status_code=500, detail="Set HF_TOKEN environment variable")
    ai_result = await call_gemma(user_input)
    carbon_score = calculate_carbon_score(user_input)
    ai_result["carbon_score"] = carbon_score
    return ai_result