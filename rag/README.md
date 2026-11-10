# Docs chat (RAG)

Small chat at the bottom right of the site. It answers **only** with the Docusaurus pages (`docs/` and `i18n/*/…/current/`), in the language of the page. Based on the RAG of `observabilidad-llm-caribeconf2026`, without LangSmith and without the PDF: here the source is the documentation itself.

| File | What it does |
| --- | --- |
| `ingest.py` | Reads every `.md`/`.mdx` page, removes front matter and JSX, splits by section and builds the FAISS index |
| `rag.py` | Finds the 5 most similar chunks in the reader's language and asks the model to answer only from them |
| `prompts.py` | System prompt: only the context; if the answer is not there, it says so |
| `api.py` | FastAPI: `POST /ask {question, locale}` → `{answer, sources}`, `GET /health` |

## Run it

```bash
cd rag
cp .env.example .env      # fill OPENAI_API_KEY and ALLOWED_ORIGINS
pip install -r requirements.txt
python ingest.py          # again every time the docs change
uvicorn api:app --host 0.0.0.0 --port 8090
```

With Docker, from the repo root: `docker build -f rag/Dockerfile -t docs-chat . && docker run --env-file rag/.env -p 8090:8090 docs-chat`.

## Connect the site

1. Publish the API over HTTPS (for example behind the core's Nginx, as `chat-buenavista.coderhivex.com`).
2. In GitHub → Settings → Secrets and variables → Actions → **Variables**, create `CHAT_API_URL` with that URL.
3. The next deploy builds the site with the chat connected. Without the variable the chat still shows, and says it is not connected yet.
