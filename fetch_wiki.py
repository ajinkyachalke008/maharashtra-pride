import urllib.request
import re

url = "https://en.wikipedia.org/wiki/File:Maharashtra_Police_Logo.png"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})

try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        # Find the full image URL in the HTML
        match = re.search(r'href="(//upload\.wikimedia\.org/wikipedia/en/[^"]+Maharashtra_Police_Logo\.png)"', html)
        if match:
            img_url = "https:" + match.group(1)
            print(f"Found image URL: {img_url}")
            
            # Download the image
            img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(img_req) as img_resp:
                with open("public/maharashtra_police_logo.png", "wb") as f:
                    f.write(img_resp.read())
            print("Downloaded successfully!")
        else:
            print("Could not find image URL in HTML.")
except Exception as e:
    print(f"Error: {e}")
