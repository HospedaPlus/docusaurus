// Builds the docs-chat index: one JSON per language with the Docusaurus pages split by section.
// It runs before `start` and `build`; the chat (src/components/DocsChat) searches it in the browser.
import {readFileSync, readdirSync, statSync, mkdirSync, writeFileSync} from 'node:fs';
import {join, relative} from 'node:path';

const LOCALES = ['en', 'es', 'pt', 'fr', 'de'];
const OUT = 'static/chat-index';

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.mdx?$/.test(f) ? [p] : [];
  });
}

function clean(text) {
  let title = '';
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (fm) {
    title = (fm[1].match(/^title:\s*['"]?(.*?)['"]?$/m) || [])[1] || '';
    text = text.slice(fm[0].length);
  }
  text = text
    .replace(/^import .*$/gm, '')
    .replace(/<[A-Z][^>]*\/>/g, '')
    .replace(/<\/?[A-Z][^>]*>/g, '')
    .trim();
  return {title, text};
}

function slugOf(rel) {
  return rel.replace(/\\/g, '/').replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
}

mkdirSync(OUT, {recursive: true});
for (const loc of LOCALES) {
  const root = loc === 'en' ? 'docs' : `i18n/${loc}/docusaurus-plugin-content-docs/current`;
  const chunks = [];
  for (const file of walk(root)) {
    const {title, text} = clean(readFileSync(file, 'utf8'));
    const path = `/docs/${slugOf(relative(root, file))}`.replace(/\/$/, '');
    // One chunk per "## " section (long sections are cut at ~1800 characters).
    for (const section of text.split(/\n(?=## )/)) {
      const heading = (section.match(/^## (.*)$/m) || [])[1] || '';
      for (let i = 0; i < section.length; i += 1800) {
        const body = section.slice(i, i + 1800).trim();
        if (body.length > 40) chunks.push({title: title || path, heading, path, text: body});
      }
    }
  }
  writeFileSync(join(OUT, `${loc}.json`), JSON.stringify(chunks));
  console.log(`chat index ${loc}: ${chunks.length} chunks`);
}
