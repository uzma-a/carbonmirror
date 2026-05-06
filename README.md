# 🌍 CarbonMirror
### AI-Powered Climate Future Simulator · Built for the Gemma 4 Good Hackathon

> Enter your lifestyle. See two versions of your 2040 — one where nothing changes, one where you do.

---

## 🚨 The Problem

Climate change is the defining crisis of our generation. Yet despite decades of warnings, global emissions continue to rise. **The data is overwhelming — but the action is not.**

Why? Because climate change feels abstract.

People hear about rising temperatures, melting glaciers, and extreme weather events — but struggle to connect those global statistics to their own daily life. A graph showing "2°C of warming by 2040" does not tell a person in Delhi what their morning commute will feel like. It does not tell a family in Noida whether their tap water will run dry. It does not tell a student in Kashmir whether the rivers they grew up with will still exist.

This emotional distance is not ignorance — **it is a failure of communication.**

Research consistently shows that people respond to personal, vivid, local information far more than abstract global data. We act when we can imagine the consequences. We change when the future feels real.

Today, climate communication fails this test. Reports are written for policymakers. Dashboards are built for scientists. The average person — the one whose daily choices actually drive emissions — has no tool that speaks directly to them, in the language of their own life.

**The result? A gap between awareness and action.**

---

## 🌍 How CarbonMirror Helps

CarbonMirror closes that gap by making climate change **personal, vivid, and impossible to ignore.**

Instead of showing graphs and statistics, CarbonMirror asks six simple questions about your lifestyle — your city, how you travel, what you eat, how much electricity you use, your AC habits, and how often you fly. Then it uses **Gemma 4** to generate two vivid, emotionally engaging simulations of your life in 2040 — one if nothing changes, and one if you make realistic improvements.

**Not a global prediction. Your prediction. Your city. Your future.**

CarbonMirror directly addresses the **Global Resilience** track by enabling long-range climate mitigation through personalized behavioral awareness. By showing individuals their exact city's climate future in 2040, CarbonMirror anticipates and responds to one of the world's most pressing challenges — at the individual level, where real behavioral change begins.

---

## 🏗️ Architecture

```
Browser (React + Tailwind + Vite)
        ↓  POST /analyze
FastAPI Backend (Python)
        ↓  Gemma 4 31B (HuggingFace Router — DeepInfra)
HuggingFace Inference API
        ↓  Structured JSON response
React renders animated staggered results
```

---

## ✨ Features

- 🎯 **Carbon Score** — Personalized 0-100 score with category breakdown
- 📊 **Before/After Chart** — Visual comparison of current vs improved lifestyle
- 🔥 **Future A** — Vivid, city-specific simulation of 2040 if nothing changes
- 🌱 **Future B** — Hopeful simulation if the user makes realistic improvements
- 📅 **30-Day Action Plan** — AI-generated personalized climate journey
- ⚡ **Top 3 Actions** — Personalized, location-specific recommendations
- 📱 **Mobile-first** — Fully responsive, works on all screen sizes
- 🎬 **Animated reveal** — Emotional staggered UI that builds contrast between futures
- ⎘ **Share button** — Copy your results to share with others

---

## 🚀 Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- Free HuggingFace token from [huggingface.co](https://huggingface.co/settings/tokens)

### Step 1 — Backend
```bash
cd backend
pip install -r requirements.txt

# Create .env file
echo "HF_TOKEN=your_huggingface_token" > .env

uvicorn main:app --reload --port 8000
```

### Step 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

### Optional — Run Gemma 4 Locally with Ollama
```bash
# Install Ollama from https://ollama.com
ollama pull gemma4:e2b
# Requires ~8GB free RAM. Close Chrome and heavy apps first.
```

---

## 📁 Project Structure

```
carbonmirror/
├── backend/
│   ├── main.py                    ← FastAPI + Gemma 4 integration
│   ├── requirements.txt
│   └── .env                       ← HF_TOKEN (never commit!)
├── frontend/
│   ├── src/
│   │   ├── App.jsx                ← routing + API call
│   │   ├── index.css              ← global styles + animations
│   │   └── components/
│   │       ├── InputForm.jsx      ← lifestyle input form
│   │       ├── LoadingScreen.jsx  ← animated loading screen
│   │       ├── Results.jsx        ← profile + futures + actions
│   │       └── ScoreCard.jsx      ← carbon score component
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── docker-compose.yml
└── README.md
```

---

## 🤖 AI Model

Uses **Gemma 4 31B Instruct** (`google/gemma-4-31B-it`) via **HuggingFace Router (DeepInfra provider)**.

### Key Prompt Techniques
- **OpenAI-compatible chat format** — `messages` with `role: user`
- **City-specific context injection** — every prompt references the user's exact location
- **Three-layer JSON extraction** — robust fallback parser handles any model output
- **Temperature 0.7** — balances creativity with factual grounding

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Vite |
| Backend | FastAPI, Python 3.11, httpx (async) |
| AI Model | Gemma 4 31B via HuggingFace Router (DeepInfra) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🌐 Deploy to Production

### Backend → Render
1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo → Root directory: `backend`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add env variable: `HF_TOKEN=your_token`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → Import repo
2. Root directory: `frontend`
3. Add env variable: `VITE_API_URL=https://your-backend.onrender.com`

---

## ⚠️ Important Notes

- Never commit `.env` file — add it to `.gitignore`
- Results are AI-generated simulations, not scientific predictions
- The `/analyze` endpoint has no rate limiting — add one before going public

---

## 📄 License

MIT — free to use, modify, and build upon.

---

*Built with ❤️ for the Gemma 4 Good Hackathon · Impact Track · Global Resilience*
