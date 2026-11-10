import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

type Chunk = { title: string; heading: string; path: string; text: string };
type Msg = {
  role: "user" | "bot";
  text: string;
  sources?: { title: string; url: string }[];
  error?: boolean;
};

const T: Record<string, Record<string, string>> = {
  en: {
    keyHelp:
      "Paste your Gemini API key to chat. It stays only in this browser and is sent only to Google.",
    save: "Save",
    forget: "Forget my key",
    title: "Ask the docs",
    hello:
      "Hi! I answer only with what is in this documentation. What do you want to know?",
    ph: "Ask about the pipeline, the pains…",
    send: "Send",
    sources: "Sources",
    thinking: "Searching the docs…",
    off: "The chat has no Gemini key yet.",
    fail: "I could not reach Gemini. Try again in a moment.",
    open: "Open chat",
    close: "Close chat",
  },
  es: {
    keyHelp:
      "Pega tu llave de API de Gemini para chatear. Se guarda solo en este navegador y solo se envía a Google.",
    save: "Guardar",
    forget: "Olvidar mi llave",
    title: "Pregúntale a la documentación",
    hello:
      "¡Hola! Respondo solo con lo que está en esta documentación. ¿Qué quieres saber?",
    ph: "Pregunta por el pipeline, los pains…",
    send: "Enviar",
    sources: "Fuentes",
    thinking: "Buscando en la documentación…",
    off: "El chat todavía no tiene llave de Gemini.",
    fail: "No pude contactar a Gemini. Intenta de nuevo en un momento.",
    open: "Abrir chat",
    close: "Cerrar chat",
  },
  pt: {
    keyHelp:
      "Cole sua chave de API do Gemini para conversar. Ela fica só neste navegador e só é enviada ao Google.",
    save: "Salvar",
    forget: "Esquecer minha chave",
    title: "Pergunte à documentação",
    hello:
      "Olá! Respondo só com o que está nesta documentação. O que você quer saber?",
    ph: "Pergunte sobre o pipeline, os pains…",
    send: "Enviar",
    sources: "Fontes",
    thinking: "Buscando na documentação…",
    off: "O chat ainda não tem chave do Gemini.",
    fail: "Não consegui contatar o Gemini. Tente de novo em instantes.",
    open: "Abrir chat",
    close: "Fechar chat",
  },
  fr: {
    keyHelp:
      "Collez votre clé API Gemini pour discuter. Elle reste uniquement dans ce navigateur et n'est envoyée qu'à Google.",
    save: "Enregistrer",
    forget: "Oublier ma clé",
    title: "Interroger la documentation",
    hello:
      "Bonjour ! Je réponds uniquement avec ce qui figure dans cette documentation. Que voulez-vous savoir ?",
    ph: "Posez une question sur le pipeline, les pains…",
    send: "Envoyer",
    sources: "Sources",
    thinking: "Recherche dans la documentation…",
    off: "Le chat n'a pas encore de clé Gemini.",
    fail: "Impossible de joindre Gemini. Réessayez dans un instant.",
    open: "Ouvrir le chat",
    close: "Fermer le chat",
  },
  de: {
    keyHelp:
      "Füge deinen Gemini-API-Schlüssel ein, um zu chatten. Er bleibt nur in diesem Browser und wird nur an Google gesendet.",
    save: "Speichern",
    forget: "Schlüssel vergessen",
    title: "Frag die Dokumentation",
    hello:
      "Hallo! Ich antworte nur mit dem, was in dieser Dokumentation steht. Was möchtest du wissen?",
    ph: "Frag nach der Pipeline, den Pains…",
    send: "Senden",
    sources: "Quellen",
    thinking: "Suche in der Dokumentation…",
    off: "Der Chat hat noch keinen Gemini-Schlüssel.",
    fail: "Gemini ist nicht erreichbar. Versuche es gleich noch einmal.",
    open: "Chat öffnen",
    close: "Chat schließen",
  },
};

const LANG: Record<string, string> = {
  en: "English",
  es: "Spanish",
  pt: "Portuguese",
  fr: "French",
  de: "German",
};
const NOT_FOUND: Record<string, string> = {
  en: "I couldn't find that information in the documentation.",
  es: "No encontré esa información en la documentación.",
  pt: "Não encontrei essa informação na documentação.",
  fr: "Je n'ai pas trouvé cette information dans la documentation.",
  de: "Ich habe diese Information in der Dokumentation nicht gefunden.",
};

function tokens(text: string): string[] {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9_]+/)
    .filter((w) => w.length > 2);
}

/** Retriever: BM25 over the sections of the docs in the reader's language. */
function retrieve(index: Chunk[], question: string, k = 5): Chunk[] {
  const q = [...new Set(tokens(question))];
  const docs = index.map((c) => tokens(`${c.title} ${c.heading} ${c.text}`));
  const avg = docs.reduce((a, d) => a + d.length, 0) / Math.max(docs.length, 1);
  const df = new Map(
    q.map((t) => [t, docs.filter((d) => d.includes(t)).length]),
  );
  const scored = docs.map((d, i) => {
    let score = 0;
    for (const t of q) {
      const tf = d.filter((w) => w === t).length;
      if (!tf) continue;
      const idf = Math.log(
        1 + (docs.length - df.get(t)! + 0.5) / (df.get(t)! + 0.5),
      );
      score += (idf * tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * (d.length / avg)));
    }
    return { i, score };
  });
  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => index[x.i]);
}

/** Same rules as the prompt of the reference RAG: only the context, no prior knowledge. */
function prompt(context: string, question: string, locale: string): string {
  return `You are the assistant of the HospedaPlus Revenue documentation site.

Rules:
1. Use only the information in the context, which comes from the Docusaurus pages.
2. Do not invent information or use prior knowledge.
3. If the answer is not in the context, reply exactly: "${NOT_FOUND[locale] ?? NOT_FOUND.en}"
4. Answer in ${LANG[locale] ?? "English"}, clearly and briefly, in plain text (short lists are fine).

------------------------
Context
------------------------
${context}

------------------------
Question
------------------------
${question}`;
}

/** Small chat at the bottom right: retrieval in the browser over the docs, answer written by Gemini. */
export default function DocsChat(): ReactNode {
  const { siteConfig, i18n } = useDocusaurusContext();
  const [key, setKey] = useState("");
  const [draftKey, setDraftKey] = useState("");
  useEffect(
    () => setKey(window.localStorage.getItem("hp-gemini-key") ?? ""),
    [],
  );
  const saveKey = (e: FormEvent) => {
    e.preventDefault();
    const k = draftKey.trim();
    if (!k) return;
    window.localStorage.setItem("hp-gemini-key", k);
    setKey(k);
    setDraftKey("");
  };
  const forgetKey = () => {
    window.localStorage.removeItem("hp-gemini-key");
    setKey("");
  };
  const model = String(
    siteConfig.customFields?.geminiModel ?? "gemini-2.5-flash",
  );
  const base = siteConfig.baseUrl;
  const index = useRef<Chunk[] | null>(null);
  const t = T[i18n.currentLocale] ?? T.en;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(
    () => end.current?.scrollIntoView({ behavior: "smooth" }),
    [msgs, busy],
  );

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const question = q.trim();
    if (!question || busy) return;
    setQ("");
    setMsgs((m) => [...m, { role: "user", text: question }]);
    if (!key) {
      setMsgs((m) => [...m, { role: "bot", text: t.off, error: true }]);
      return;
    }
    setBusy(true);
    try {
      if (!index.current) {
        const r = await fetch(`${base}chat-index/${i18n.currentLocale}.json`);
        index.current = (await r.json()) as Chunk[];
      }
      const docs = retrieve(index.current, question);
      if (docs.length === 0) {
        setMsgs((m) => [
          ...m,
          { role: "bot", text: NOT_FOUND[i18n.currentLocale] ?? NOT_FOUND.en },
        ]);
        return;
      }
      const context = docs
        .map(
          (d) => `# ${d.title}${d.heading ? ` · ${d.heading}` : ""}\n${d.text}`,
        )
        .join("\n\n---\n\n");
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: prompt(context, question, i18n.currentLocale) },
                ],
              },
            ],
            generationConfig: { temperature: 0 },
          }),
        },
      );
      if (!r.ok) throw new Error(String(r.status));
      const data = await r.json();
      const answer: string = (data.candidates?.[0]?.content?.parts ?? [])
        .map((p: { text?: string }) => p.text ?? "")
        .join("")
        .trim();
      const seen = new Set<string>();
      const sources = docs
        .filter((d) => !seen.has(d.path) && seen.add(d.path))
        .slice(0, 3)
        .map((d) => ({ title: d.title, url: `${base}${d.path.slice(1)}` }));
      const notFound =
        answer === (NOT_FOUND[i18n.currentLocale] ?? NOT_FOUND.en);
      setMsgs((m) => [
        ...m,
        {
          role: "bot",
          text: answer || t.fail,
          sources: notFound ? [] : sources,
          error: !answer,
        },
      ]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: t.fail, error: true }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.wrap}>
      {open && (
        <section className={styles.panel} aria-label={t.title}>
          <header className={styles.head}>
            <strong>{t.title}</strong>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.close}
            >
              ×
            </button>
          </header>
          <div className={styles.body}>
            <div className={clsx(styles.msg, styles.bot)}>{t.hello}</div>
            {msgs.map((m, i) => (
              <div
                key={i}
                className={clsx(
                  styles.msg,
                  styles[m.role],
                  m.error && styles.err,
                )}
              >
                <span className={styles.text}>{m.text}</span>
                {m.sources && m.sources.length > 0 && (
                  <span className={styles.sources}>
                    {t.sources}:{" "}
                    {m.sources.map((s, j) => (
                      <a key={s.url} href={s.url}>
                        {s.title}
                        {j < m.sources!.length - 1 ? " · " : ""}
                      </a>
                    ))}
                  </span>
                )}
              </div>
            ))}
            {busy && (
              <div className={clsx(styles.msg, styles.bot, styles.typing)}>
                {t.thinking}
              </div>
            )}
            <div ref={end} />
          </div>
          {!key ? (
            <form className={styles.keyForm} onSubmit={saveKey}>
              <span>{t.keyHelp}</span>
              <div className={styles.form}>
                <input
                  type="password"
                  value={draftKey}
                  onChange={(e) => setDraftKey(e.target.value)}
                  placeholder="AIza…"
                  autoComplete="off"
                />
                <button type="submit" disabled={!draftKey.trim()}>
                  {t.save}
                </button>
              </div>
            </form>
          ) : (
            <form className={styles.form} onSubmit={send}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.ph}
                maxLength={500}
              />
              <button type="submit" disabled={busy || !q.trim()}>
                {t.send}
              </button>
              <button
                type="button"
                className={styles.forget}
                onClick={forgetKey}
                title={t.forget}
                aria-label={t.forget}
              >
                ⎋
              </button>
            </form>
          )}
        </section>
      )}
      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen(!open)}
        aria-label={open ? t.close : t.open}
      >
        {open ? (
          "×"
        ) : (
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
