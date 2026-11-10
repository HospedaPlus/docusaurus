"""Builds the FAISS index from the Docusaurus pages only (docs/ and i18n/<lang>/.../current/).

Run it again after the docs change:  python ingest.py
"""
import re

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

import config


def clean(text: str) -> tuple[str, str]:
    """Removes front matter, imports and JSX tags; returns (title, text)."""
    title = ""
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if m:
        t = re.search(r"^title:\s*['\"]?(.*?)['\"]?$", m.group(1), re.M)
        title = t.group(1) if t else ""
        text = text[m.end():]
    text = re.sub(r"^import .*$", "", text, flags=re.M)
    text = re.sub(r"<[A-Z][^>]*/>", "", text)
    text = re.sub(r"</?[A-Z][^>]*>", "", text)
    return title, text.strip()


def page_url(locale: str, rel: str) -> str:
    slug = re.sub(r"\.mdx?$", "", rel)
    slug = re.sub(r"(^|/)index$", "", slug)
    prefix = "" if locale == "en" else f"/{locale}"
    return f"{config.SITE_URL}{prefix}/docs/{slug}".rstrip("/")


def load() -> list[Document]:
    docs = []
    roots = {"en": config.DOCS_ROOT / "docs"}
    for loc in config.LOCALES[1:]:
        roots[loc] = config.DOCS_ROOT / "i18n" / loc / "docusaurus-plugin-content-docs" / "current"
    for loc, root in roots.items():
        for f in sorted(root.rglob("*.md*")):
            rel = f.relative_to(root).as_posix()
            title, text = clean(f.read_text(encoding="utf-8"))
            if text:
                docs.append(Document(page_content=text, metadata={"locale": loc, "title": title or rel, "url": page_url(loc, rel)}))
    return docs


def main() -> None:
    pages = load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150,
                                              separators=["\n## ", "\n### ", "\n\n", "\n", " "])
    chunks = splitter.split_documents(pages)
    for c in chunks:
        c.page_content = f"# {c.metadata['title']}\n{c.page_content}"
    store = FAISS.from_documents(chunks, OpenAIEmbeddings(model=config.EMBEDDING_MODEL))
    config.VECTORSTORE_PATH.parent.mkdir(parents=True, exist_ok=True)
    store.save_local(str(config.VECTORSTORE_PATH))
    print(f"{len(pages)} pages, {len(chunks)} chunks -> {config.VECTORSTORE_PATH}")


if __name__ == "__main__":
    main()
