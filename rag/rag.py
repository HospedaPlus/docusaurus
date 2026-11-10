"""RAG over the Docusaurus pages: FAISS retriever + OpenAI chat model. No LangSmith."""
from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

import config
from prompts import RAG_PROMPT

LANGUAGES = {"en": "English", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German"}

embeddings = OpenAIEmbeddings(model=config.EMBEDDING_MODEL)
vectorstore = FAISS.load_local(str(config.VECTORSTORE_PATH), embeddings, allow_dangerous_deserialization=True)
llm = ChatOpenAI(model=config.CHAT_MODEL, temperature=0)
chain = RAG_PROMPT | llm | StrOutputParser()


def ask(question: str, locale: str = "es", k: int = 5) -> dict:
    """Retrieves the k most similar chunks in the reader's language, then answers from them."""
    locale = locale if locale in LANGUAGES else "en"
    docs = vectorstore.similarity_search(question, k=k, filter={"locale": locale}, fetch_k=40)
    context = "\n\n---\n\n".join(d.page_content for d in docs)
    answer = chain.invoke({"context": context, "question": question, "language": LANGUAGES[locale]})
    sources, seen = [], set()
    for d in docs:
        if d.metadata["url"] not in seen:
            seen.add(d.metadata["url"])
            sources.append({"title": d.metadata["title"], "url": d.metadata["url"]})
    return {"answer": answer, "sources": sources[:3]}
