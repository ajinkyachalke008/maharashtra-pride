import os
import re

readme_path = 'c:/Users/HP/Desktop/new 1/maharashtra-pride-1/README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

# BLOCK 1
old_block_1 = """```text
📥 RAW EVIDENCE
        ↓
🤖 AI EXTRACTION
        ↓
🌐 GRAPH INTELLIGENCE
        ↓
🧠 RISK ANALYTICS
        ↓
⚖️ LEGAL MAPPING
        ↓
📜 COURT ADMISSIBLE REPORTS
```"""

new_block_1 = """<div align="center">

📥 <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=20&duration=2000&pause=500&color=00E5FF&center=true&vCenter=true&width=600&lines=RAW+EVIDENCE+%5BText+Scramble+Effect%5D"/>
<br><strong style="color: #00FFB3;">↓</strong><br>
🤖 <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=20&duration=2000&pause=500&color=00FFB3&center=true&vCenter=true&width=600&lines=AI+EXTRACTION+%5BDecode+Animation%5D"/>
<br><strong style="color: #00FFB3;">↓</strong><br>
🌐 <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=20&duration=2000&pause=500&color=7C3AED&center=true&vCenter=true&width=600&lines=GRAPH+INTELLIGENCE+%5BParticle+Network%5D"/>
<br><strong style="color: #00FFB3;">↓</strong><br>
🧠 <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=20&duration=2000&pause=500&color=FFB300&center=true&vCenter=true&width=600&lines=RISK+ANALYTICS+%5BMatrix+Rain+Effect%5D"/>
<br><strong style="color: #00FFB3;">↓</strong><br>
⚖️ <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=20&duration=2000&pause=500&color=10B981&center=true&vCenter=true&width=600&lines=LEGAL+MAPPING+%5BCyberpunk+Scanline%5D"/>
<br><strong style="color: #00FFB3;">↓</strong><br>
📜 <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=20&duration=2000&pause=500&color=FF5252&center=true&vCenter=true&width=600&lines=COURT+ADMISSIBLE+REPORTS+%5BHolographic+Effect%5D"/>

</div>"""

content = content.replace(old_block_1, new_block_1)


# BLOCK 2
old_block_2 = """```text
₹100,000+ Volume
       ↓
Risk Score ≥ 0.90
       ↓
🔴 Critical Threat
```"""

new_block_2 = """<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=20&duration=2000&pause=500&color=00E5FF&center=true&vCenter=true&width=600&lines=₹100,000%2B+Volume+%5BData+Stream+Animation%5D"/>
<br><strong style="color: #FF5252;">↓</strong><br>
<img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=20&duration=2000&pause=500&color=FFB300&center=true&vCenter=true&width=600&lines=Risk+Score+≥+0.90+%5BNeon+Flicker+Effect%5D"/>
<br><strong style="color: #FF5252;">↓</strong><br>
🔴 <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=20&duration=2000&pause=500&color=FF5252&center=true&vCenter=true&width=600&lines=Critical+Threat+%5BGlitch+Effect%5D"/>

</div>"""

content = content.replace(old_block_2, new_block_2)


# BLOCK 3
# Since "Generated Evidence Packages" was changed to an animated header, the text below it needs to be found.
# Let's use regex to find and replace the specific bullet points.

replacements_3 = {
    "📄 Court-Admissible Reports": "📄 <img src=\"https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=18&duration=2000&pause=500&color=00E5FF&center=false&vCenter=true&width=800&lines=Court-Admissible+Reports+%5BTypewriter+Effect%5D\"/>",
    "🕒 Timestamped Evidence Trails": "🕒 <img src=\"https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=18&duration=2000&pause=500&color=00FFB3&center=false&vCenter=true&width=800&lines=Timestamped+Evidence+Trails+%5BSplit+Text+Animation%5D\"/>",
    "🔗 Chain Of Custody Records": "🔗 <img src=\"https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=18&duration=2000&pause=500&color=7C3AED&center=false&vCenter=true&width=800&lines=Chain+Of+Custody+Records+%5BHacker+Text+Reveal%5D\"/>",
    "🧠 Intelligence Findings": "🧠 <img src=\"https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=18&duration=2000&pause=500&color=FFB300&center=false&vCenter=true&width=800&lines=Intelligence+Findings+%5BRandom+Character+Reveal%5D\"/>",
    "📊 Transaction Narratives": "📊 <img src=\"https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=18&duration=2000&pause=500&color=10B981&center=false&vCenter=true&width=800&lines=Transaction+Narratives+%5BCyber+Decrypt+Reveal%5D\"/>",
    "⚖️ Legal Documentation": "⚖️ <img src=\"https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=18&duration=2000&pause=500&color=FF5252&center=false&vCenter=true&width=800&lines=Legal+Documentation+%5BLiquid+Distortion%5D\"/>"
}

for old, new in replacements_3.items():
    content = content.replace(old, new)

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
