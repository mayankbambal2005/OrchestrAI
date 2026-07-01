import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-key-here")
SERPAPI_KEY    = os.getenv("SERPAPI_KEY", "your-serpapi-key-here")
MONGO_URI      = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME        = os.getenv("DB_NAME", "orchestrai")
