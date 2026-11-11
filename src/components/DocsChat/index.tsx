import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useLocation } from "@docusaurus/router";
import { Highlight, themes } from "prism-react-renderer";
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
    minimize: "Minimize chat",
    expand: "Expand chat",
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
    minimize: "Minimizar chat",
    expand: "Expandir chat",
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
    minimize: "Minimizar chat",
    expand: "Expandir chat",
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
    minimize: "Réduire le chat",
    expand: "Agrandir le chat",
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
    minimize: "Chat minimieren",
    expand: "Chat erweitern",
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

const STOP = new Set(
  "the and for how did does what when where which who why with that this from are was were you your can about into its como que los las del por para una uno con cual cuales donde cuando sobre esta este eso son fue se les mas the und die der das ist wie les des une est dans pour qui quoi com uma dos das".split(
    " ",
  ),
);

/** Very light stemmer so "pains", "solved" and "solving" match "pain" and "solve". */
function stem(w: string): string {
  if (w.length <= 4 || w.includes("_")) return w;
  return w.replace(/(ciones|cion|mente|ing|ed|es|s)$/, "") || w;
}

function tokens(text: string): string[] {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9_]+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map(stem);
}

/** Retriever: BM25 over the sections of the docs in the reader's language. */
function retrieve(index: Chunk[], question: string, page = "", k = 8): Chunk[] {
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
    // Small boost for the page the reader is on: questions are often about it.
    if (score > 0 && page && index[i].path === page) score *= 1.4;
    return { i, score };
  });
  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => index[x.i]);
}

/** Same idea as the reference RAG (only the docs as context), with a friendlier, simpler voice. */
function prompt(
  context: string,
  question: string,
  locale: string,
  history: string,
): string {
  return `You are the friendly assistant of the HospedaPlus documentation site.

How to answer:
1. Use only the information in the context below (it comes from the documentation pages). Do not invent facts or use outside knowledge.
2. Be warm and kind. Explain in very simple, clear words, as if to someone new to data engineering. Start with a one-sentence direct answer, then the details.
3. Use Markdown: short paragraphs, bullet lists, **bold** for key names, and fenced code blocks (with the language, e.g. \`\`\`python or \`\`\`sql) when you show code. If the reader asks for code, copy the relevant code snippets from the context and explain each one in a line or two.
4. If the context only partly answers, answer with what it does say. Only when the context has nothing related, reply: "${NOT_FOUND[locale] ?? NOT_FOUND.en}" and suggest what they could ask instead.
5. Answer in ${LANG[locale] ?? "English"}. Keep it reasonably short.

------------------------
Context
------------------------
${context}
${history ? `\n------------------------\nPrevious conversation\n------------------------\n${history}\n` : ""}
------------------------
Question
------------------------
${question}`;
}

/** Models tried in order; lighter ones have more free quota. */
const FALLBACK_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
];

const wait = (ms: number) => new Promise((ok) => setTimeout(ok, ms));

/**
 * Calls Gemini and streams the answer through onText. Thinking is kept low so
 * answers start quickly. On 429 (quota) or 5xx (overloaded) it waits and tries
 * again, then moves to the next model. A bad key (400/401/403) stops at once.
 */
async function callGemini(
  key: string,
  model: string,
  text: string,
  onText: (t: string) => void,
): Promise<string> {
  const models = [model, ...FALLBACK_MODELS.filter((m) => m !== model)];
  let last = "";
  for (const m of models) {
    let thinking = true;
    for (let attempt = 0; attempt < 3; attempt++) {
      let r: Response;
      try {
        r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${m}:streamGenerateContent?alt=sse&key=${encodeURIComponent(key)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text }] }],
              generationConfig: {
                temperature: 0.2,
                ...(thinking
                  ? { thinkingConfig: { thinkingLevel: "low" } }
                  : {}),
              },
            }),
          },
        );
      } catch {
        last = "network error";
        await wait(1500);
        continue;
      }
      if (!r.ok || !r.body) {
        const data = await r.json().catch(() => ({}));
        const msg: string = data?.error?.message ?? r.statusText;
        last = `${r.status}: ${msg}`;
        // Some models do not accept the thinking setting: retry without it.
        if (r.status === 400 && thinking && /think/i.test(msg)) {
          thinking = false;
          continue;
        }
        if ([400, 401, 403].includes(r.status)) throw new Error(last);
        if (r.status === 404) break;
        await wait(1500 * (attempt + 1));
        continue;
      }
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const events = buf.split(/\r?\n\r?\n/);
        buf = events.pop() ?? "";
        for (const ev of events) {
          const line = ev.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          try {
            const data = JSON.parse(line.slice(5));
            for (const p of data.candidates?.[0]?.content?.parts ?? []) {
              if (p.text && !p.thought) answer += p.text;
            }
            onText(answer);
          } catch {
            /* partial event, ignore */
          }
        }
      }
      return answer.trim();
    }
  }
  throw new Error(last);
}

/** Code block with syntax colors (the chat lives outside the theme providers, so no @theme/CodeBlock). */
function Code({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={styles.code}>
      <button
        type="button"
        className={styles.copy}
        onClick={() => {
          void navigator.clipboard?.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "✓" : "⧉"}
      </button>
      <Highlight code={code} language={language} theme={themes.vsDark}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, j) => (
                  <span key={j} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

/** Inline Markdown: `code`, **bold**, *italic* and [links](url). */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`"))
      out.push(<code key={k++}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("**"))
      out.push(<strong key={k++}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("["))
      out.push(
        <a key={k++} href={tok.slice(tok.indexOf("(") + 1, -1)}>
          {tok.slice(1, tok.indexOf("]"))}
        </a>,
      );
    else out.push(<em key={k++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Small Markdown renderer for the answers: paragraphs, lists, headings and code blocks. */
function Markdown({ text }: { text: string }): ReactNode {
  const blocks: ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^\s*```\s*([\w+-]*)/);
    if (fence) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i]))
        code.push(lines[i++]);
      i++;
      blocks.push(
        <Code key={k++} language={fence[1] || "text"} code={code.join("\n")} />,
      );
      continue;
    }
    if (/^\s*([-*•]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*•]|\d+\.)\s+/.test(lines[i]))
        items.push(lines[i++].replace(/^\s*([-*•]|\d+\.)\s+/, ""));
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={k++}>
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </List>,
      );
      continue;
    }
    const h = line.match(/^#{1,4}\s+(.*)/);
    if (h) {
      blocks.push(
        <p key={k++} className={styles.mdHead}>
          {inline(h[1])}
        </p>,
      );
      i++;
      continue;
    }
    if (!line.trim()) {
      i++;
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\s*(```|[-*•]\s|\d+\.\s|#{1,4}\s)/.test(lines[i])
    )
      para.push(lines[i++]);
    blocks.push(<p key={k++}>{inline(para.join(" "))}</p>);
  }
  return <div className={styles.md}>{blocks}</div>;
}

/** Small chat at the bottom right: retrieval in the browser over the docs, answer written by Gemini. */
const Ico = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
// Expand: two diagonal arrows pointing out; minimize: a line; close: an X
const ICON_EXPAND = "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7";
const ICON_MIN = "M5 12h14";
const ICON_CLOSE = "M6 6l12 12M18 6L6 18";

export default function DocsChat(): ReactNode {
  const { siteConfig, i18n } = useDocusaurusContext();
  const [key, setKey] = useState("");
  const [draftKey, setDraftKey] = useState("");
  useEffect(() => {
    setKey(window.localStorage.getItem("hp-gemini-key") ?? "");
  }, []);
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
    siteConfig.customFields?.geminiModel ?? "gemini-3.5-flash",
  );
  const base = siteConfig.baseUrl;
  const index = useRef<Chunk[] | null>(null);
  const t = T[i18n.currentLocale] ?? T.en;
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Block body on purpose: newer browsers return a Promise from
    // scrollIntoView, and React would call it as a cleanup and crash.
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

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
    const setLast = (patch: Partial<Msg>) =>
      setMsgs((m) => [...m.slice(0, -1), { ...m[m.length - 1], ...patch }]);
    try {
      if (!index.current) {
        const r = await fetch(`${base}chat-index/${i18n.currentLocale}.json`);
        index.current = (await r.json()) as Chunk[];
      }
      // Follow-up questions ("I mean the code") reuse the previous question for search.
      const prevQ = [...msgs].reverse().find((m) => m.role === "user")?.text;
      const page = `/${pathname.slice(base.length)}`
        .replace(/^\/(en|es|pt|fr|de)\//, "/")
        .replace(/\/$/, "");
      let docs = retrieve(index.current, question, page);
      if (prevQ && docs.length < 8) {
        const more = retrieve(index.current, `${prevQ} ${question}`, page);
        docs = [...docs, ...more.filter((d) => !docs.includes(d))].slice(0, 8);
      }
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
      const history = msgs
        .filter((m) => !m.error)
        .slice(-4)
        .map(
          (m) =>
            `${m.role === "user" ? "Reader" : "Assistant"}: ${m.text.slice(0, 600)}`,
        )
        .join("\n");
      setMsgs((m) => [...m, { role: "bot", text: "" }]);
      const answer = await callGemini(
        key,
        model,
        prompt(context, question, i18n.currentLocale, history),
        (partial) => setLast({ text: partial }),
      );
      const seen = new Set<string>();
      const sources = docs
        .filter((d) => !seen.has(d.path) && seen.add(d.path))
        .slice(0, 3)
        .map((d) => ({ title: d.title, url: `${base}${d.path.slice(1)}` }));
      const notFound = answer.startsWith(
        NOT_FOUND[i18n.currentLocale] ?? NOT_FOUND.en,
      );
      setLast({
        text: answer || t.fail,
        sources: notFound ? [] : sources,
        error: !answer,
      });
    } catch (err) {
      const detail = err instanceof Error ? err.message : "";
      const text = detail ? `${t.fail}\n(${detail})` : t.fail;
      setMsgs((m) =>
        m[m.length - 1]?.role === "bot" && !m[m.length - 1].text
          ? [...m.slice(0, -1), { role: "bot", text, error: true }]
          : [...m, { role: "bot", text, error: true }],
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.wrap}>
      {open && (
        <section
          className={clsx(styles.panel, min && styles.minimized)}
          aria-label={t.title}
        >
          <header className={styles.head}>
            <button
              type="button"
              className={styles.headTitle}
              onClick={() => setMin(!min)}
              aria-label={min ? t.expand : t.minimize}
            >
              <strong>{t.title}</strong>
            </button>
            <span className={styles.headActions}>
              <button
                type="button"
                onClick={() => setMin(!min)}
                aria-label={min ? t.expand : t.minimize}
                title={min ? t.expand : t.minimize}
              >
                <Ico d={min ? ICON_EXPAND : ICON_MIN} />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.close}
                title={t.close}
              >
                <Ico d={ICON_CLOSE} />
              </button>
            </span>
          </header>
          <div className={styles.body}>
            <div className={clsx(styles.msg, styles.bot)}>{t.hello}</div>
            {msgs.map((m, i) =>
              !m.text ? null : (
                <div
                  key={i}
                  className={clsx(
                    styles.msg,
                    styles[m.role],
                    m.error && styles.err,
                  )}
                >
                  {m.role === "bot" && !m.error ? (
                    <Markdown text={m.text} />
                  ) : (
                    <span className={styles.text}>{m.text}</span>
                  )}
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
              ),
            )}
            {busy && !msgs[msgs.length - 1]?.text && (
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
      {!(open && min) && (
        <button
          type="button"
          className={styles.fab}
          onClick={() => {
            setOpen(!open);
            setMin(false);
          }}
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
      )}
    </div>
  );
}
