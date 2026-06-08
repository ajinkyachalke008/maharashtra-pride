import os
import io
import json
import pandas as pd
import pdfplumber
from docx import Document
from openai import OpenAI
from typing import List, Dict, Any

# Ensure we have the API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Initialize OpenRouter client via OpenAI SDK
# If the key is not set, we pass a dummy string so the app doesn't crash on startup.
# We will catch the error dynamically during the actual parsing if needed.
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY or "dummy_key",
)

SYSTEM_PROMPT = """
You are a highly sophisticated cybercrime financial intelligence agent.
Your task is to extract financial entities and their transactions from the provided unstructured or semi-structured text.
You must output ONLY valid JSON.

Schema Required:
{
  "transactions": [
    {
      "transaction_ref": "Unique ID if available, else generated",
      "timestamp": "ISO8601 date or approximate",
      "amount": numeric_value,
      "currency": "INR",
      "direction": "CREDIT|DEBIT",
      "from_account": "Account ID or name of sender",
      "to_account": "Account ID or name of receiver",
      "transaction_type": "UPI|IMPS|NEFT|RTGS|CASH|UNKNOWN",
      "upi_id": "UPI ID if present",
      "narration": "Original text description",
      "confidence": numeric_value_between_0_and_1
    }
  ]
}

If a field is missing or cannot be confidently extracted, leave it as null.
Extract every single transaction you can find. 
If the text contains no transactions, return {"transactions": []}.
Output purely the JSON, with no markdown wrappers or formatting blocks.
"""

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    ext = filename.split('.')[-1].lower()
    text = ""
    
    try:
        if ext == 'pdf':
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        elif ext in ['xlsx', 'xls', 'csv']:
            # Read via pandas
            if ext == 'csv':
                df = pd.read_csv(io.BytesIO(file_content))
            else:
                df = pd.read_excel(io.BytesIO(file_content))
            text = df.to_string()
        elif ext == 'docx':
            doc = Document(io.BytesIO(file_content))
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            text = file_content.decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error extracting text from {filename}: {e}")
        
    return text

def parse_financial_text(text: str) -> Dict[str, Any]:
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is not set. Cannot use LLM extraction.")
        
    # We truncate text if it's wildly long, OpenRouter context window is usually large
    # but we'll cap at 15000 chars for safety in this demo
    safe_text = text[:15000]
    
    response = client.chat.completions.create(
        model="google/gemini-2.5-pro", # A good model for data extraction available on OpenRouter
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Extract transactions from this text:\n\n{safe_text}"}
        ],
        temperature=0.0
    )
    
    result_text = response.choices[0].message.content.strip()
    
    # Strip markdown if the model hallucinates it despite instructions
    if result_text.startswith("```json"):
        result_text = result_text[7:]
    if result_text.startswith("```"):
        result_text = result_text[3:]
    if result_text.endswith("```"):
        result_text = result_text[:-3]
        
    result_text = result_text.strip()
    
    try:
        return json.loads(result_text)
    except json.JSONDecodeError:
        print(f"Failed to parse JSON from LLM: {result_text}")
        return {"transactions": []}
