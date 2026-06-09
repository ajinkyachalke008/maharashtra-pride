import json
import os
import networkx as nx
from networkx.readwrite import json_graph

import tempfile

STORE_FILE = os.path.join(tempfile.gettempdir(), "graph_store.json") if os.environ.get("VERCEL") else "graph_store.json"

class Database:
    def __init__(self):
        self.graph = nx.MultiDiGraph()
        self.cases = []
        self.load()

    def connect(self):
        # Local mock logic, no actual network connection needed
        pass

    def close(self):
        self.save()

    def get_session(self):
        # We don't use sessions for in-memory graph, just return self
        return self

    def load(self):
        if os.path.exists(STORE_FILE):
            try:
                with open(STORE_FILE, 'r') as f:
                    data = json.load(f)
                    # Load graph
                    if "graph" in data:
                        self.graph = json_graph.node_link_graph(data["graph"])
                    # Load cases
                    if "cases" in data:
                        self.cases = data["cases"]
                print(f"Loaded database from {STORE_FILE} (Nodes: {self.graph.number_of_nodes()}, Edges: {self.graph.number_of_edges()})")
            except Exception as e:
                print(f"Error loading {STORE_FILE}: {e}")
                self.graph = nx.MultiDiGraph()
                self.cases = []
        else:
            print("No existing store found, initializing empty graph.")

    def save(self):
        try:
            data = {
                "graph": json_graph.node_link_data(self.graph),
                "cases": self.cases
            }
            with open(STORE_FILE, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Failed to save {STORE_FILE}: {e}")

# Global database instance
db = Database()

def init_schema():
    # Schema isn't strictly necessary for NetworkX since it's schemaless,
    # but we load the data and ensure everything is ready.
    db.load()
    print("Local database schema/engine initialized successfully.")
