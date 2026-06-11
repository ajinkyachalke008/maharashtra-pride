import os
import logging
import json
import networkx as nx
from networkx.readwrite import json_graph
from neo4j import GraphDatabase, exceptions

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Neo4j connection defaults
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "fraudlens_secret")

PORTABLE_STORE_FILE = "graph_store.json"

class Database:
    def __init__(self):
        self.driver = None
        self.engine_type = "unknown"
        # Fallback NetworkX structures
        self.nx_graph = nx.MultiDiGraph()
        self.cases = []

    def connect(self):
        try:
            # Attempt Neo4j connection
            self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD), connection_timeout=2)
            self.driver.verify_connectivity()
            self.engine_type = "neo4j"
            logger.info(f"Successfully connected to Neo4j at {NEO4J_URI}")
        except Exception as e:
            logger.warning(f"Neo4j connection failed: {e}. Falling back to PORTABLE NetworkX engine.")
            self.engine_type = "networkx_portable"
            self.load_portable()

    def close(self):
        if self.engine_type == "neo4j" and self.driver:
            self.driver.close()
            logger.info("Closed Neo4j connection.")
        elif self.engine_type == "networkx_portable":
            self.save_portable()
            logger.info("Saved portable graph state.")

    def get_session(self):
        if self.engine_type == "neo4j":
            return self.driver.session()
        return None

    # --- PORTABLE ENGINE METHODS ---
    def load_portable(self):
        if os.path.exists(PORTABLE_STORE_FILE):
            try:
                with open(PORTABLE_STORE_FILE, 'r') as f:
                    data = json.load(f)
                    if "graph" in data:
                        self.nx_graph = json_graph.node_link_graph(data["graph"])
                    if "cases" in data:
                        self.cases = data["cases"]
                logger.info(f"Loaded portable DB. Nodes: {self.nx_graph.number_of_nodes()}, Edges: {self.nx_graph.number_of_edges()}")
            except Exception as e:
                logger.error(f"Error loading {PORTABLE_STORE_FILE}: {e}")
                self.nx_graph = nx.MultiDiGraph()
        else:
            logger.info("Initializing new empty portable graph.")

    def save_portable(self):
        if self.engine_type != "networkx_portable":
            return
        try:
            data = {
                "graph": json_graph.node_link_data(self.nx_graph),
                "cases": self.cases
            }
            with open(PORTABLE_STORE_FILE, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save portable DB: {e}")

# Global database instance
db = Database()

def init_schema():
    """ Initialize Neo4j constraints/indexes or do nothing if Portable. """
    if db.engine_type != "neo4j":
        logger.info("Skipping Neo4j schema init (running in Portable Mode).")
        return

    queries = [
        "CREATE CONSTRAINT IF NOT EXISTS FOR (t:Transaction) REQUIRE t.txn_id IS UNIQUE",
        "CREATE CONSTRAINT IF NOT EXISTS FOR (a:Account) REQUIRE a.account_number IS UNIQUE",
        "CREATE CONSTRAINT IF NOT EXISTS FOR (c:Case) REQUIRE c.case_id IS UNIQUE",
        "CREATE INDEX IF NOT EXISTS FOR (a:Account) ON (a.fraud_score)",
        "CREATE INDEX IF NOT EXISTS FOR (a:Account) ON (a.risk_tier)",
        "CREATE INDEX IF NOT EXISTS FOR (t:Transaction) ON (t.created_at)"
    ]
    try:
        with db.get_session() as session:
            for query in queries:
                session.run(query)
        logger.info("Neo4j Schema initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing schema: {e}")
