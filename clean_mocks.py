import os
import re

TARGET_DIR = r"c:\Users\HP\Desktop\new 1\maharashtra-pride-1\src\routes\fraudlens"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to match `const MOCK_NAME: Type[] = [ ... ];` or `const MOCK_NAME = [ ... ];`
    # We will match `const MOCK_[A-Z_]+(:[^=]+)?\s*=\s*\[` up to the closing `];`
    
    # 1. Match Arrays
    content = re.sub(r'(const\s+MOCK_[A-Z_]+(?:\s*:\s*[A-Za-z_\[\]]+)?\s*=\s*)\[.*?\];', r'\1[];', content, flags=re.DOTALL)
    
    # 2. Match Objects (e.g. const MOCK_DATA = { ... }; in osint.tsx)
    # Be careful with this, as we want to replace with `{}`
    # For osint.tsx, `const MOCK_DATA = { ... };` 
    # MOCK_LINKS_DATA, MOCK_GRAPH_DATA in intelligence.tsx
    content = re.sub(r'(const\s+MOCK_LINKS_DATA\s*=\s*)\{.*?\}\s*;', r'\1{ links: [], total_syndicates_detected: 0 };', content, flags=re.DOTALL)
    content = re.sub(r'(const\s+MOCK_GRAPH_DATA\s*=\s*)\{.*?\}\s*;', r'\1{ nodes: [], links: [] };', content, flags=re.DOTALL)
    content = re.sub(r'(const\s+MOCK_DATA\s*=\s*)\{.*?\}\s*;', r'\1{};', content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Cleaned {filepath}")

for root, _, files in os.walk(TARGET_DIR):
    for f in files:
        if f.endswith(".tsx"):
            process_file(os.path.join(root, f))
