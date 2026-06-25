import os

readme_path = 'c:/Users/HP/Desktop/new 1/maharashtra-pride-1/README.md'

with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 13 modules table
old_table = """| Intelligence System | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| 📥 Ingest           | AI-powered evidence ingestion & transaction extraction |
| 🌐 Graph            | Interactive 3D criminal syndicate visualization        |
| ⚖️ Intelligence     | BNS 2023 legal intelligence & threat mapping           |
| 🧠 ML Lab           | Latent-space anomaly detection & clustering            |
| 📂 Cases            | Kanban-based investigation management                  |
| 📜 Reports          | Section 65B court-ready report generation              |
| 🚨 Alerts           | Real-time WebSocket intelligence feed                  |
| 🏦 Entities         | Centralized account intelligence registry              |
| 🗺️ Maps            | Geospatial transaction analysis                        |
| 🔍 OSINT            | Open-source intelligence enrichment                    |
| 🧩 Patterns         | Fraud typology detection engine                        |
| 🚫 Watchlist        | High-risk entity monitoring                            |
| 🎯 Command Center   | Executive intelligence dashboard                       |"""

new_table = """| Intelligence System | Purpose                                                | Tech Badge |
| ------------------- | ------------------------------------------------------ | :--- |
| 📥 Ingest           | AI-powered evidence ingestion & transaction extraction | ![Dropzone](https://img.shields.io/badge/Feature-Drag_&_Drop-6A5ACD?style=flat-square) |
| 🌐 Graph            | Interactive 3D criminal syndicate visualization        | ![WebGL](https://img.shields.io/badge/Render-WebGL_3D-FF4500?style=flat-square) |
| ⚖️ Intelligence     | BNS 2023 legal intelligence & threat mapping           | ![BNS](https://img.shields.io/badge/Legal-BNS_2023-DC143C?style=flat-square) |
| 🧠 ML Lab           | Latent-space anomaly detection & clustering            | ![ML](https://img.shields.io/badge/Machine_Learning-Active-00FA9A?style=flat-square) |
| 📂 Cases            | Kanban-based investigation management                  | ![Kanban](https://img.shields.io/badge/UI-React_Beautiful_Dnd-4169E1?style=flat-square) |
| 📜 Reports          | Section 65B court-ready report generation              | ![PDF](https://img.shields.io/badge/Export-fpdf2-8A2BE2?style=flat-square) |
| 🚨 Alerts           | Real-time WebSocket intelligence feed                  | ![Live](https://img.shields.io/badge/Stream-WebSockets-FF00FF?style=flat-square) |
| 🏦 Entities         | Centralized account intelligence registry              | ![Data](https://img.shields.io/badge/View-Data_Grid-20B2AA?style=flat-square) |
| 🗺️ Maps            | Geospatial transaction analysis                        | ![MapLibre](https://img.shields.io/badge/Map-MapLibre_GL-FFA500?style=flat-square) |
| 🔍 OSINT            | Open-source intelligence enrichment                    | ![OSINT](https://img.shields.io/badge/Intel-Dark_Web-000000?style=flat-square) |
| 🧩 Patterns         | Fraud typology detection engine                        | ![Typology](https://img.shields.io/badge/Analysis-Typology-B22222?style=flat-square) |
| 🚫 Watchlist        | High-risk entity monitoring                            | ![Hotlist](https://img.shields.io/badge/Alert-High_Risk-FF0000?style=flat-square) |
| 🎯 Command Center   | Executive intelligence dashboard                       | ![Command](https://img.shields.io/badge/Dashboard-Executive-4B0082?style=flat-square) |"""

content = content.replace(old_table, new_table)


# Replace Evidence Sources
old_evidence = """### Supported Evidence Sources

```text
📄 PDF Statements
📊 Excel Files
📋 CSV Data
📝 Word Documents
📷 Screenshots
💬 WhatsApp Chats
🏦 Banking Records
```"""

new_evidence = """### Supported Evidence Sources

<div align="center">
  <img src="https://img.shields.io/badge/📄_PDF-Statements-D32F2F?style=for-the-badge&labelColor=0B1020"/>
  <img src="https://img.shields.io/badge/📊_Excel-Files-107C41?style=for-the-badge&labelColor=0B1020"/>
  <img src="https://img.shields.io/badge/📋_CSV-Data-217346?style=for-the-badge&labelColor=0B1020"/>
  <img src="https://img.shields.io/badge/📝_Word-Documents-2B579A?style=for-the-badge&labelColor=0B1020"/>
  <img src="https://img.shields.io/badge/📷_Screenshots-Images-FF9800?style=for-the-badge&labelColor=0B1020"/>
  <img src="https://img.shields.io/badge/💬_WhatsApp-Chats-25D366?style=for-the-badge&labelColor=0B1020"/>
  <img src="https://img.shields.io/badge/🏦_Banking-Records-3F51B5?style=for-the-badge&labelColor=0B1020"/>
</div>"""

content = content.replace(old_evidence, new_evidence)

# Replace Visual Threat Classification
old_threat = """### Visual Threat Classification

```text
🔵 Normal Entity

🟡 Elevated Risk

🟠 High Risk

🔴 Critical Threat
```"""

new_threat = """### Visual Threat Classification

<div align="center">
  <br>
  <img src="https://img.shields.io/badge/🔵_Normal-Entity-2196F3?style=for-the-badge&labelColor=0B1020"/>
  <img src="https://img.shields.io/badge/🟡_Elevated-Risk-FFC107?style=for-the-badge&labelColor=0B1020"/>
  <img src="https://img.shields.io/badge/🟠_High-Risk-FF9800?style=for-the-badge&labelColor=0B1020"/>
  <img src="https://img.shields.io/badge/🔴_Critical-Threat-F44336?style=for-the-badge&labelColor=0B1020"/>
  <br>
</div>"""

content = content.replace(old_threat, new_threat)

# Replace ML Risk
old_ml = """```text
🟢 LOW
      ↓
🟡 MEDIUM
      ↓
🟠 HIGH
      ↓
🔴 CRITICAL
```"""

new_ml = """<div align="center">
  <img src="https://img.shields.io/badge/🟢_LOW-Risk-4CAF50?style=for-the-badge&labelColor=0B1020"/> ➜ 
  <img src="https://img.shields.io/badge/🟡_MEDIUM-Risk-FFC107?style=for-the-badge&labelColor=0B1020"/> ➜ 
  <img src="https://img.shields.io/badge/🟠_HIGH-Risk-FF9800?style=for-the-badge&labelColor=0B1020"/> ➜ 
  <img src="https://img.shields.io/badge/🔴_CRITICAL-Risk-F44336?style=for-the-badge&labelColor=0B1020"/>
</div>"""

content = content.replace(old_ml, new_ml)

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
