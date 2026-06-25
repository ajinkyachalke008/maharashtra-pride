import os
import re
import urllib.parse

readme_path = 'c:/Users/HP/Desktop/new 1/maharashtra-pride-1/README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'https://readme-typing-svg\.herokuapp\.com\?([^"]+)')

configs = [
    {"font": "Cinzel", "duration": "4000", "pause": "2000", "weight": "700"},
    {"font": "Share+Tech+Mono", "duration": "600", "pause": "300", "weight": "500"},
    {"font": "Fira+Code", "duration": "1200", "pause": "1000", "weight": "600"},
    {"font": "VT323", "duration": "800", "pause": "400", "weight": "400"},
    {"font": "Play", "duration": "2500", "pause": "1500", "weight": "700"},
    {"font": "Orbitron", "duration": "1800", "pause": "1200", "weight": "800"},
    {"font": "JetBrains+Mono", "duration": "1500", "pause": "800", "weight": "500"},
    {"font": "Righteous", "duration": "2200", "pause": "1000", "weight": "400"},
    {"font": "Rajdhani", "duration": "1000", "pause": "600", "weight": "700"}
]

config_idx = 0

def replace_url(match):
    global config_idx
    query_str = match.group(1)
    params = urllib.parse.parse_qs(query_str, keep_blank_values=True)
    
    lines_list = params.get('lines', [''])
    # parse_qs sometimes splits by commas if not careful, but for 'lines' it might just return the raw string.
    # Actually `urllib.parse.urlencode` might be safer, but we can build it manually.
    lines = urllib.parse.quote_plus(urllib.parse.unquote_plus(lines_list[0]))
    
    size = params.get('size', ['20'])[0]
    color = params.get('color', ['00FFB3'])[0]
    center = params.get('center', ['false'])[0]
    width = params.get('width', ['500'])[0]
    vCenter = params.get('vCenter', ['true'])[0]
    
    cfg = configs[config_idx % len(configs)]
    config_idx += 1
    
    new_query = f"font={cfg['font']}&weight={cfg['weight']}&size={size}&duration={cfg['duration']}&pause={cfg['pause']}&color={color}&center={center}&vCenter={vCenter}&width={width}&lines={lines}"
    
    return f"https://readme-typing-svg.herokuapp.com?{new_query}"

new_content = pattern.sub(replace_url, content)

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("done")
