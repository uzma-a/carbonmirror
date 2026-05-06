# 🌍 CarbonMirror
### AI-Powered Climate Future Simulator · Built for the Gemma 4 Good Hackathon

> Enter your lifestyle. See two versions of your 2040 — one where nothing changes, one where you do.

---

## 🏗️ Architecture

```
Browser (React + Tailwind + Vite)
        ↓  POST /analyze
FastAPI Backend (Python)

        ↓  Gemma 4 E2B (Ollama — local inference)
Local GPU/CPU
        ↓  Gemma 4 12B API (Google AI Studio)
Google Generative AI
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
- [Ollama](https://ollama.com) installed

### Step 1 — Install Ollama & Gemma 4
```bash
# Download Ollama from https://ollama.com
# Then pull Gemma 4:
ollama pull gemma4:e2b
```

### Step 2 — Start Ollama
```bash
ollama serve
```

### Step 3 — Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Step 4 — Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

> ⚠️ **RAM Note:** Gemma 4 E2B requires ~8GB free RAM.
> Close Chrome and heavy apps before running for best performance.

---

## 📁 Project Structure

```
carbonmirror/
├── backend/
│   ├── main.py              ← FastAPI + Gemma 4 Ollama integration
│   ├── requirements.txt
│   └── .env                 ← environment config
├── frontend/
│   ├── src/
│   │   ├── App.jsx               ← routing + API call
│   │   ├── index.css             ← global styles + animations
│   │   └── components/
│   │       ├── InputForm.jsx      ← lifestyle input form
│   │       ├── LoadingScreen.jsx  ← animated loading screen
│   │       ├── Results.jsx        ← profile + futures + actions
│   │       └── ScoreCard.jsx      ← carbon score component
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── carbonmirror_gemma4.ipynb  ← Kaggle Notebook (Gemma 4 + Gradio)
├── docker-compose.yml
└── README.md
```

---

## 🤖 AI Model

<<<<<<< HEAD
### Web Application
Uses **Gemma 4 E2B** (`gemma4:e2b`) running locally via **Ollama**.
=======
This project uses **Gemma 4 31B Instruct** (`gemma-4-31b-it`) via Google AI Studio.
>>>>>>> 616bcc2 (update main.py)

- No API key required
- Runs on local CPU/GPU
- Full privacy — data never leaves your machine

### Kaggle Notebook
Uses **Gemma 4 26B A4B** (`google/gemma-4/transformers/gemma-4-26b-a4b`) running on Kaggle T4 GPU with full Gradio UI including:
- Carbon Score Board
- Before/After Comparison Chart
- AI-Generated 30-Day Action Plan

### Key Prompt Techniques
- **Ollama chat format** — `messages` with `role: user` structure
- **City-specific context injection** — every prompt references exact location
- **Three-layer JSON extraction** — robust fallback parser
- **Temperature 0.7** — balances creativity with factual grounding

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Vite |
<<<<<<< HEAD
| Backend | FastAPI, Python 3.11, httpx (async) |
| AI Model (Local) | Gemma 4 E2B via Ollama |
| AI Model (Notebook) | Gemma 4 26B via Kaggle GPU |
| Notebook UI | Gradio |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🖥️ Alternative — Run with Ollama Cloud / HuggingFace

If you don't have enough RAM locally, you can use HuggingFace Router:

```python
# In backend/main.py, replace Ollama config with:
HF_TOKEN = "your_hf_token"
HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
MODEL = "google/gemma-4-31B-it:novita"
```

Get free HuggingFace token at: https://huggingface.co/settings/tokens
=======
| Backend | FastAPI, Python 3.11 |
| AI | Gemma 4 31B (Google AI Studio) |
| HTTP Client | httpx (async) |
| Deployment | Vercel (frontend) + Railway (backend) |
>>>>>>> 616bcc2 (update main.py)

---

## ⚠️ Important Notes

- Gemma 4 E2B requires ~8GB free RAM — close other apps before running
- Results are AI-generated simulations, not scientific predictions
- The `/analyze` endpoint has no rate limiting — add one before going public

---

## 📄 License

MIT — free to use, modify, and build upon.

---

*Built with ❤️ for the Gemma 4 Good Hackathon · Impact Track · Global Resilience*