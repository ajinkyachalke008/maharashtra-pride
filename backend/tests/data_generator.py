"""
FraudLens — Synthetic Indian Fraud Data Generator (Layer 9)
===========================================================
Generates realistic UPI transactions, fraud patterns, and case records
for testing the FraudLens intelligence platform.

CLI: python data_generator.py --transactions 1000 --cases 50 --output ./fixtures/

Patterns injected:
  - 15% flagged as suspicious (high velocity, round amounts, late night, new accounts)
  - 5% forming a hawala ring (circular transactions A→B→C→D→A)
  - 3% forming a mule network (hub-and-spoke: one account fans out to many)
"""

import argparse
import csv
import json
import os
import random
import string
from datetime import datetime, timedelta
from typing import Any

# ═══════════════════════════════════════════════════════════════════════════
# CONSTANTS — Real Indian financial data
# ═══════════════════════════════════════════════════════════════════════════

BANKS = [
    {"name": "State Bank of India", "code": "SBI", "ifsc_prefix": "SBIN", "upi_handles": ["@sbi", "@oksbi"]},
    {"name": "HDFC Bank", "code": "HDFC", "ifsc_prefix": "HDFC", "upi_handles": ["@ybl", "@hdfcbank"]},
    {"name": "ICICI Bank", "code": "ICICI", "ifsc_prefix": "ICIC", "upi_handles": ["@ibl", "@icici"]},
    {"name": "Axis Bank", "code": "AXIS", "ifsc_prefix": "UTIB", "upi_handles": ["@axl", "@axisbank"]},
    {"name": "Punjab National Bank", "code": "PNB", "ifsc_prefix": "PUNB", "upi_handles": ["@pnb"]},
    {"name": "Kotak Mahindra Bank", "code": "KOTAK", "ifsc_prefix": "KKBK", "upi_handles": ["@kotak"]},
    {"name": "Yes Bank", "code": "YES", "ifsc_prefix": "YESB", "upi_handles": ["@ybl"]},
    {"name": "IDFC First Bank", "code": "IDFC", "ifsc_prefix": "IDFB", "upi_handles": ["@idfcbank"]},
]

FIRST_NAMES = [
    "Rajesh", "Priya", "Suresh", "Anita", "Vikram", "Deepa", "Amit", "Sunita",
    "Sanjay", "Kavita", "Rahul", "Neha", "Arun", "Pooja", "Manoj", "Rekha",
    "Nitin", "Swati", "Ashok", "Meena", "Ravi", "Sneha", "Kiran", "Nisha",
    "Sachin", "Jyoti", "Prakash", "Divya", "Vinod", "Aarti",
]

LAST_NAMES = [
    "Patil", "Sharma", "Deshmukh", "Kulkarni", "Jadhav", "More", "Pawar",
    "Joshi", "Shinde", "Gaikwad", "Bhosale", "Chavan", "Kadam", "Salunkhe",
    "Deshpande", "Iyer", "Reddy", "Khan", "Verma", "Gupta",
]

SECTIONS_OF_LAW = [
    "IT Act 66D", "BNS 318(4)", "BNS 336(3)", "PMLA 3", "PMLA 4",
    "FEMA 3(a)", "IT Act 43", "IT Act 66", "IT Act 66C",
    "BNS 319", "BNSS 94", "DPDP Act 2023 Sec 8",
]

CASE_STATUSES = ["open", "under_investigation", "chargesheeted", "closed"]
PRIORITIES = ["critical", "high", "medium", "low"]
TXN_TYPES = ["UPI", "NEFT", "RTGS", "IMPS"]

MAHARASHTRA_DISTRICTS = [
    "Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad", "Solapur",
    "Kolhapur", "Thane", "Satara", "Sangli", "Ahmednagar", "Ratnagiri",
]


# ═══════════════════════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════════════════════


def gen_ifsc(bank: dict) -> str:
    """Generate valid IFSC: 4 alpha + '0' + 6 alphanumeric."""
    suffix = "".join(random.choices(string.digits, k=6))
    return f"{bank['ifsc_prefix']}0{suffix}"


def gen_upi_id(name: str, bank: dict) -> str:
    """Generate UPI ID in name@bankcode format."""
    handle = random.choice(bank["upi_handles"])
    clean = name.lower().replace(" ", ".")
    if random.random() < 0.3:
        clean = f"{clean}{random.randint(1, 999)}"
    return f"{clean}{handle}"


def gen_account_number() -> str:
    """Generate a realistic 10-14 digit account number."""
    length = random.choice([10, 11, 12, 14])
    return "".join(random.choices(string.digits, k=length))


def gen_date(months_back: int = 12) -> str:
    """Generate a random date in DD/MM/YYYY format within the last N months."""
    start = datetime.now() - timedelta(days=months_back * 30)
    delta = timedelta(days=random.randint(0, months_back * 30))
    dt = start + delta
    return dt.strftime("%d/%m/%Y")


def gen_timestamp(date_str: str, suspicious: bool = False) -> str:
    """Generate a timestamp. Suspicious = late night (00:00-05:00)."""
    if suspicious:
        hour = random.randint(0, 4)
    else:
        hour = random.randint(6, 23)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    return f"{date_str} {hour:02d}:{minute:02d}:{second:02d}"


def gen_amount(suspicious: bool = False) -> float:
    """Generate INR amount. Suspicious = round large numbers."""
    if suspicious:
        return float(random.choice([100000, 200000, 500000, 1000000, 2500000, 5000000]))
    return round(random.uniform(100, 500000), 2)


def format_inr(amount: float) -> str:
    """Format amount with Indian L/Cr suffixes."""
    if amount >= 10000000:
        return f"₹{amount / 10000000:.2f}Cr"
    if amount >= 100000:
        return f"₹{amount / 100000:.2f}L"
    return f"₹{amount:,.2f}"


# ═══════════════════════════════════════════════════════════════════════════
# GENERATORS
# ═══════════════════════════════════════════════════════════════════════════


def generate_accounts(n: int) -> list[dict]:
    """Generate N unique account records."""
    accounts = []
    for i in range(n):
        bank = random.choice(BANKS)
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        name = f"{first} {last}"
        accounts.append({
            "account_id": f"ACCT-{bank['code']}-{gen_account_number()}",
            "holder_name": name,
            "bank_name": bank["name"],
            "bank_code": bank["code"],
            "ifsc": gen_ifsc(bank),
            "upi_id": gen_upi_id(name, bank),
            "account_number": gen_account_number(),
            "district": random.choice(MAHARASHTRA_DISTRICTS),
            "created_days_ago": random.randint(1, 3650),
        })
    return accounts


def generate_transactions(
    n: int,
    accounts: list[dict],
    suspicious_pct: float = 0.15,
    hawala_pct: float = 0.05,
    mule_pct: float = 0.03,
) -> list[dict]:
    """
    Generate N transactions with injected fraud patterns.

    Returns list of transaction dicts with is_suspicious, pattern_type flags.
    """
    transactions: list[dict] = []
    n_hawala = int(n * hawala_pct)
    n_mule = int(n * mule_pct)
    n_suspicious = int(n * suspicious_pct) - n_hawala - n_mule
    n_clean = n - n_hawala - n_mule - n_suspicious

    txn_id = 1

    # ── Clean transactions ───────────────────────────────────────────
    for _ in range(n_clean):
        sender = random.choice(accounts)
        receiver = random.choice([a for a in accounts if a["account_id"] != sender["account_id"]])
        date = gen_date()
        transactions.append({
            "transaction_id": f"TXN-{datetime.now().year}-{txn_id:06d}",
            "timestamp": gen_timestamp(date, suspicious=False),
            "amount": gen_amount(suspicious=False),
            "currency": "INR",
            "sender_account": sender["account_id"],
            "sender_upi": sender["upi_id"],
            "sender_bank": sender["bank_name"],
            "sender_ifsc": sender["ifsc"],
            "receiver_account": receiver["account_id"],
            "receiver_upi": receiver["upi_id"],
            "receiver_bank": receiver["bank_name"],
            "receiver_ifsc": receiver["ifsc"],
            "transaction_type": random.choice(TXN_TYPES),
            "narration": f"Payment for {random.choice(['services', 'goods', 'rent', 'EMI', 'investment', 'loan repayment'])}",
            "is_suspicious": False,
            "pattern_type": None,
        })
        txn_id += 1

    # ── Suspicious transactions (non-pattern) ────────────────────────
    for _ in range(max(0, n_suspicious)):
        sender = random.choice(accounts)
        receiver = random.choice([a for a in accounts if a["account_id"] != sender["account_id"]])
        date = gen_date()
        transactions.append({
            "transaction_id": f"TXN-{datetime.now().year}-{txn_id:06d}",
            "timestamp": gen_timestamp(date, suspicious=True),
            "amount": gen_amount(suspicious=True),
            "currency": "INR",
            "sender_account": sender["account_id"],
            "sender_upi": sender["upi_id"],
            "sender_bank": sender["bank_name"],
            "sender_ifsc": sender["ifsc"],
            "receiver_account": receiver["account_id"],
            "receiver_upi": receiver["upi_id"],
            "receiver_bank": receiver["bank_name"],
            "receiver_ifsc": receiver["ifsc"],
            "transaction_type": random.choice(TXN_TYPES),
            "narration": random.choice(["Investment return", "Lucky draw", "Refund", "Commission"]),
            "is_suspicious": True,
            "pattern_type": "high_risk_individual",
        })
        txn_id += 1

    # ── Hawala ring (circular: A→B→C→D→A) ───────────────────────────
    ring_size = 4
    n_rings = max(1, n_hawala // ring_size)
    for ring_idx in range(n_rings):
        ring_accounts = random.sample(accounts, min(ring_size, len(accounts)))
        ring_amount = random.choice([200000, 300000, 500000])
        for i in range(len(ring_accounts)):
            sender = ring_accounts[i]
            receiver = ring_accounts[(i + 1) % len(ring_accounts)]
            date = gen_date(months_back=3)
            transactions.append({
                "transaction_id": f"TXN-{datetime.now().year}-{txn_id:06d}",
                "timestamp": gen_timestamp(date, suspicious=True),
                "amount": ring_amount + random.uniform(-5000, 5000),
                "currency": "INR",
                "sender_account": sender["account_id"],
                "sender_upi": sender["upi_id"],
                "sender_bank": sender["bank_name"],
                "sender_ifsc": sender["ifsc"],
                "receiver_account": receiver["account_id"],
                "receiver_upi": receiver["upi_id"],
                "receiver_bank": receiver["bank_name"],
                "receiver_ifsc": receiver["ifsc"],
                "transaction_type": "NEFT",
                "narration": "Business payment",
                "is_suspicious": True,
                "pattern_type": "hawala_ring",
            })
            txn_id += 1

    # ── Mule network (hub-and-spoke) ─────────────────────────────────
    n_mule_txns = max(1, n_mule)
    hub = random.choice(accounts)
    spokes = random.sample([a for a in accounts if a["account_id"] != hub["account_id"]], min(n_mule_txns, len(accounts) - 1))
    for spoke in spokes:
        date = gen_date(months_back=2)
        transactions.append({
            "transaction_id": f"TXN-{datetime.now().year}-{txn_id:06d}",
            "timestamp": gen_timestamp(date, suspicious=True),
            "amount": gen_amount(suspicious=True),
            "currency": "INR",
            "sender_account": hub["account_id"],
            "sender_upi": hub["upi_id"],
            "sender_bank": hub["bank_name"],
            "sender_ifsc": hub["ifsc"],
            "receiver_account": spoke["account_id"],
            "receiver_upi": spoke["upi_id"],
            "receiver_bank": spoke["bank_name"],
            "receiver_ifsc": spoke["ifsc"],
            "transaction_type": "UPI",
            "narration": "Salary transfer",
            "is_suspicious": True,
            "pattern_type": "mule_network",
        })
        txn_id += 1

    random.shuffle(transactions)
    return transactions


def generate_cases(n: int, year: int = 2025) -> list[dict]:
    """Generate N realistic Pune Cyber Crime Cell case records."""
    cases = []
    for i in range(1, n + 1):
        complainant_first = random.choice(FIRST_NAMES)
        complainant_last = random.choice(LAST_NAMES)
        accused_first = random.choice(FIRST_NAMES)
        accused_last = random.choice(LAST_NAMES)
        amount = round(random.uniform(50000, 50000000), 2)
        n_sections = random.randint(1, 4)

        cases.append({
            "case_id": f"PCCC-{year}-{i:04d}",
            "fir_number": f"FIR/{year}/PC/{random.randint(100, 9999):04d}",
            "title": random.choice([
                "UPI fraud ring targeting senior citizens",
                "Phishing attack via fake banking app",
                "Investment scam through Telegram channel",
                "SIM swap fraud — unauthorized fund transfer",
                "Fake KYC update — account takeover",
                "Loan app extortion syndicate",
                "Cryptocurrency laundering via P2P exchange",
                "QR code tampering at merchant terminals",
            ]),
            "complainant": f"{complainant_first} {complainant_last}",
            "accused": f"{accused_first} {accused_last}" if random.random() > 0.3 else "Unknown",
            "sections": random.sample(SECTIONS_OF_LAW, n_sections),
            "estimated_fraud_amount": amount,
            "estimated_fraud_amount_formatted": format_inr(amount),
            "status": random.choice(CASE_STATUSES),
            "priority": random.choice(PRIORITIES),
            "district": random.choice(MAHARASHTRA_DISTRICTS),
            "date_filed": gen_date(months_back=12),
            "investigating_officer": f"Insp. {random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}",
            "victim_count": random.randint(1, 50),
        })
    return cases


# ═══════════════════════════════════════════════════════════════════════════
# OUTPUT
# ═══════════════════════════════════════════════════════════════════════════


def save_json(data: Any, filepath: str) -> None:
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False, default=str)
    print(f"  ✅ Saved JSON: {filepath} ({len(data)} records)")


def save_csv(data: list[dict], filepath: str) -> None:
    if not data:
        return
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
    print(f"  ✅ Saved CSV:  {filepath} ({len(data)} records)")


def main():
    parser = argparse.ArgumentParser(description="FraudLens Synthetic Data Generator")
    parser.add_argument("--transactions", type=int, default=1000, help="Number of transactions (default: 1000)")
    parser.add_argument("--cases", type=int, default=50, help="Number of cases (default: 50)")
    parser.add_argument("--accounts", type=int, default=100, help="Number of accounts (default: 100)")
    parser.add_argument("--output", type=str, default="./fixtures/", help="Output directory (default: ./fixtures/)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")
    args = parser.parse_args()

    random.seed(args.seed)
    os.makedirs(args.output, exist_ok=True)

    print(f"\n🔧 FraudLens Data Generator")
    print(f"   Accounts: {args.accounts} | Transactions: {args.transactions} | Cases: {args.cases}")
    print(f"   Output: {args.output}\n")

    # Generate
    accounts = generate_accounts(args.accounts)
    transactions = generate_transactions(args.transactions, accounts)
    cases = generate_cases(args.cases)

    # Stats
    suspicious = [t for t in transactions if t["is_suspicious"]]
    hawala = [t for t in transactions if t.get("pattern_type") == "hawala_ring"]
    mule = [t for t in transactions if t.get("pattern_type") == "mule_network"]
    print(f"   📊 Suspicious: {len(suspicious)} ({len(suspicious)/len(transactions)*100:.1f}%)")
    print(f"   🔄 Hawala rings: {len(hawala)} transactions")
    print(f"   🕸️  Mule network: {len(mule)} transactions\n")

    # Save
    save_json(accounts, os.path.join(args.output, "accounts.json"))
    save_json(transactions, os.path.join(args.output, "transactions.json"))
    save_json(cases, os.path.join(args.output, "cases.json"))
    save_csv(transactions, os.path.join(args.output, "transactions.csv"))
    save_csv(cases, os.path.join(args.output, "cases.csv"))

    print(f"\n✅ Generation complete!\n")


if __name__ == "__main__":
    main()
