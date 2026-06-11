import requests
import json

API_BASE = "https://backend-wine-zeta-81.vercel.app/api/v1"

print("1. Uploading unstructured FIR text...")
with open("mock_fir.txt", "rb") as f:
    res = requests.post(f"{API_BASE}/ingest/file", files={"file": ("mock_fir.txt", f, "text/plain")})

data = res.json()
print("Extracted transactions from Gemini:")
print(json.dumps(data, indent=2))

if not data.get("transactions"):
    print("FAILED: No transactions parsed.")
    exit(1)

print("\n2. Committing to Graph DB...")
commit_res = requests.post(f"{API_BASE}/ingest/commit", json=data)
print("Commit response:", commit_res.json())

print("\n3. Verifying Graph DB Subgraph for 'Rahul Sharma'...")
graph_res = requests.get(f"{API_BASE}/graph/subgraph?account_id=Rahul Sharma&hops=2")
graph_data = graph_res.json()

nodes = [n["id"] for n in graph_data.get("nodes", [])]
print(f"Nodes found: {nodes}")

if "Rahul Sharma" in nodes and "ACC-MULE-101" in nodes:
    print("\nSUCCESS! The pipeline correctly ingested unstructured text into the graph database!")
else:
    print("\nFAILED: Graph did not contain the expected nodes.")
