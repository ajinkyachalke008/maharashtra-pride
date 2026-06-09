import urllib.request
url = 'https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Maharashtra_Police_Insignia_India.svg/250px-Maharashtra_Police_Insignia_India.svg.png'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    with open('public/maharashtra_police_logo.png', 'wb') as f:
        f.write(response.read())
print('Downloaded')
