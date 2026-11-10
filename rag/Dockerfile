FROM python:3.12-slim
WORKDIR /app/rag
COPY rag/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY docs /app/docs
COPY i18n /app/i18n
COPY rag /app/rag
EXPOSE 8090
# Builds the index at start if it is missing (needs OPENAI_API_KEY), then serves the API.
CMD ["sh", "-c", "[ -f vectorstore/faiss_index/index.faiss ] || python ingest.py; uvicorn api:app --host 0.0.0.0 --port 8090"]
