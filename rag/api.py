"""HTTP API used by the chat widget of the site:  uvicorn api:app --host 0.0.0.0 --port 8090"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import config
from rag import ask

app = FastAPI(title="HospedaPlus docs chat")
app.add_middleware(CORSMiddleware, allow_origins=config.ALLOWED_ORIGINS, allow_methods=["POST", "GET"],
                   allow_headers=["Content-Type"])


class Question(BaseModel):
    question: str = Field(min_length=2, max_length=500)
    locale: str = "es"


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/ask")
def ask_endpoint(q: Question) -> dict:
    return ask(q.question, q.locale)
