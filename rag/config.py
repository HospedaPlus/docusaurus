"""Settings read from the environment (.env). No LangSmith: nothing is traced outside this service."""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()
os.environ.pop("LANGSMITH_TRACING", None)
os.environ["LANGCHAIN_TRACING_V2"] = "false"

ROOT = Path(__file__).resolve().parent
DOCS_ROOT = ROOT.parent  # the Docusaurus repo
VECTORSTORE_PATH = ROOT / "vectorstore" / "faiss_index"
CHAT_MODEL = os.getenv("CHAT_MODEL", "gpt-4o-mini")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",") if o.strip()]
SITE_URL = os.getenv("SITE_URL", "https://hospedaplus.github.io/docusaurus")
LOCALES = ["en", "es", "pt", "fr", "de"]
