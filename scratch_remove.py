import os

readme_path = 'c:/Users/HP/Desktop/new 1/maharashtra-pride-1/README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "### ✨ Comprehensive UI/UX Animation Engine"
end_marker = "## 📁 Directory Structure Overview"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + content[end_idx:]
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("removed")
else:
    print("not found")
