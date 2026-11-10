import {useEffect, useRef, useState, type FormEvent, type ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

type Msg = {role: 'user' | 'bot'; text: string; sources?: {title: string; url: string}[]; error?: boolean};

const T: Record<string, Record<string, string>> = {
  en: {title: 'Ask the docs', hello: 'Hi! I answer only with what is in this documentation. What do you want to know?', ph: 'Ask about the pipeline, the pains…', send: 'Send', sources: 'Sources', thinking: 'Searching the docs…', off: 'The chat is not connected to its API yet.', fail: 'I could not reach the chat API. Try again in a moment.', open: 'Open chat', close: 'Close chat'},
  es: {title: 'Pregúntale a la documentación', hello: '¡Hola! Respondo solo con lo que está en esta documentación. ¿Qué quieres saber?', ph: 'Pregunta por el pipeline, los pains…', send: 'Enviar', sources: 'Fuentes', thinking: 'Buscando en la documentación…', off: 'El chat todavía no está conectado a su API.', fail: 'No pude contactar la API del chat. Intenta de nuevo en un momento.', open: 'Abrir chat', close: 'Cerrar chat'},
  pt: {title: 'Pergunte à documentação', hello: 'Olá! Respondo só com o que está nesta documentação. O que você quer saber?', ph: 'Pergunte sobre o pipeline, os pains…', send: 'Enviar', sources: 'Fontes', thinking: 'Buscando na documentação…', off: 'O chat ainda não está conectado à sua API.', fail: 'Não consegui contatar a API do chat. Tente de novo em instantes.', open: 'Abrir chat', close: 'Fechar chat'},
  fr: {title: 'Interroger la documentation', hello: 'Bonjour ! Je réponds uniquement avec ce qui figure dans cette documentation. Que voulez-vous savoir ?', ph: 'Posez une question sur le pipeline, les pains…', send: 'Envoyer', sources: 'Sources', thinking: 'Recherche dans la documentation…', off: "Le chat n'est pas encore connecté à son API.", fail: "Impossible de joindre l'API du chat. Réessayez dans un instant.", open: 'Ouvrir le chat', close: 'Fermer le chat'},
  de: {title: 'Frag die Dokumentation', hello: 'Hallo! Ich antworte nur mit dem, was in dieser Dokumentation steht. Was möchtest du wissen?', ph: 'Frag nach der Pipeline, den Pains…', send: 'Senden', sources: 'Quellen', thinking: 'Suche in der Dokumentation…', off: 'Der Chat ist noch nicht mit seiner API verbunden.', fail: 'Die Chat-API ist nicht erreichbar. Versuche es gleich noch einmal.', open: 'Chat öffnen', close: 'Chat schließen'},
};

/** Small chat at the bottom right that asks the RAG API (rag/api.py), which only knows the Docusaurus pages. */
export default function DocsChat(): ReactNode {
  const {siteConfig, i18n} = useDocusaurusContext();
  const api = String(siteConfig.customFields?.chatApiUrl ?? '').replace(/\/$/, '');
  const t = T[i18n.currentLocale] ?? T.en;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => end.current?.scrollIntoView({behavior: 'smooth'}), [msgs, busy]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const question = q.trim();
    if (!question || busy) return;
    setQ('');
    setMsgs((m) => [...m, {role: 'user', text: question}]);
    if (!api) {
      setMsgs((m) => [...m, {role: 'bot', text: t.off, error: true}]);
      return;
    }
    setBusy(true);
    try {
      const r = await fetch(`${api}/ask`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question, locale: i18n.currentLocale}),
      });
      if (!r.ok) throw new Error(String(r.status));
      const data = (await r.json()) as {answer: string; sources: Msg['sources']};
      setMsgs((m) => [...m, {role: 'bot', text: data.answer, sources: data.sources}]);
    } catch {
      setMsgs((m) => [...m, {role: 'bot', text: t.fail, error: true}]);
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
            <button type="button" onClick={() => setOpen(false)} aria-label={t.close}>
              ×
            </button>
          </header>
          <div className={styles.body}>
            <div className={clsx(styles.msg, styles.bot)}>{t.hello}</div>
            {msgs.map((m, i) => (
              <div key={i} className={clsx(styles.msg, styles[m.role], m.error && styles.err)}>
                <span className={styles.text}>{m.text}</span>
                {m.sources && m.sources.length > 0 && (
                  <span className={styles.sources}>
                    {t.sources}:{' '}
                    {m.sources.map((s, j) => (
                      <a key={s.url} href={s.url}>
                        {s.title}
                        {j < m.sources!.length - 1 ? ' · ' : ''}
                      </a>
                    ))}
                  </span>
                )}
              </div>
            ))}
            {busy && <div className={clsx(styles.msg, styles.bot, styles.typing)}>{t.thinking}</div>}
            <div ref={end} />
          </div>
          <form className={styles.form} onSubmit={send}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.ph} maxLength={500} />
            <button type="submit" disabled={busy || !q.trim()}>
              {t.send}
            </button>
          </form>
        </section>
      )}
      <button type="button" className={styles.fab} onClick={() => setOpen(!open)} aria-label={open ? t.close : t.open}>
        {open ? '×' : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
