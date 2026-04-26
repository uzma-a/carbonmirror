# 🌍 CarbonMirror
### AI-Powered Climate Future Simulator · Built for the Gemma 4 Good Hackathon

> Enter your lifestyle. See two versions of your 2040 — one where nothing changes, one where you do.

---

## 🔗 Links
- 🌐 **Live Demo:** https://carbonmirror.vercel.app
- 📹 **Demo Video:** https://youtube.com/your-video-link

---

## 🏗️ Architecture

```
Browser (React + Tailwind + Vite)
        ↓  POST /analyze
FastAPI Backend (Python)
        ↓  Gemma 3 12B API (Google AI Studio)
Google Generative AI
        ↓  Structured JSON response
React renders animated results
```

---

## ✨ Features

- 🔥 **Future A** — Vivid, city-specific simulation of 2040 if nothing changes
- 🌱 **Future B** — Hopeful simulation if the user makes realistic improvements
- ⚡ **Top 3 Actions** — Personalized, location-specific recommendations
- 📱 **Mobile-first** — Fully responsive, works on all screen sizes
- 🎬 **Animated reveal** — Emotional staggered UI that builds contrast between futures
- ⎘ **Share button** — Copy your results to share with others

---

## 🚀 Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- Free Gemma API key from [Google AI Studio](https://aistudio.google.com/)

### Backend
```bash
cd backend
pip install -r requirements.txt

# Create .env file
echo "GEMMA_API_KEY=your_key_here" > .env

uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

---

## 📁 Project Structure

```
carbonmirror/
├── backend/
│   ├── main.py              ← FastAPI + Gemma integration
│   ├── requirements.txt
│   └── .env                 ← your API key (never commit this)
├── frontend/
│   ├── src/
│   │   ├── App.jsx          ← routing + API call
│   │   ├── index.css        ← global styles + animations
│   │   └── components/
│   │       ├── InputForm.jsx      ← lifestyle input form
│   │       ├── LoadingScreen.jsx  ← animated loading
│   │       └── Results.jsx        ← profile + futures + actions
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── docker-compose.yml
└── README.md
```

---

## 🤖 AI Model

This project uses **Gemma 3 12B Instruct** (`gemma-3-12b-it`) via Google AI Studio.

Key prompt techniques used:
- **Role-based conversation turns** (`user` / `model`) for instruction-tuned models
- **JSON priming** — pre-filling the model turn with `{` to force structured output
- **City-specific context injection** — every prompt references the user's exact location
- **Temperature 0.7** — balances creativity with factual grounding

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Vite |
| Backend | FastAPI, Python 3.11 |
| AI | Gemma 3 12B (Google AI Studio) |
| HTTP Client | httpx (async) |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## 📄 License

MIT — free to use, modify, and build upon.

---

*Built with ❤️ for the Gemma 4 Good Hackathon*
