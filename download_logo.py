import sys
import urllib.request
from duckduckgo_search import DDGS

def get_logo():
    ddgs = DDGS()
    results = ddgs.images("maharashtra police logo transparent png", max_results=5)
    for res in results:
        url = res.get("image")
        if url:
            try:
                print(f"Trying to download from: {url}")
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
                with urllib.request.urlopen(req, timeout=10) as response:
                    content = response.read()
                    if len(content) > 1000:  # Validate it's an actual image
                        with open("public/maharashtra_police_logo.png", "wb") as f:
                            f.write(content)
                        print("Success!")
                        return
            except Exception as e:
                print(f"Failed: {e}")
                continue
    print("Failed to download any logo.")

if __name__ == "__main__":
    get_logo()
