import urllib.request, json, sys

key = input("Paste your GEMMA_API_KEY: ").strip()
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"

with urllib.request.urlopen(url) as r:
    data = json.loads(r.read())

print("\n✅ Models that support generateContent:\n")
for m in data.get("models", []):
    methods = m.get("supportedGenerationMethods", [])
    if "generateContent" in methods:
        print(f"  {m['name']}")