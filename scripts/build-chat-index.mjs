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
    // One chunk per "## " or "### " section; long sections are cut at ~2400
    // characters with a small overlap so code blocks are not lost at the edge.
    let parent = '';
    for (const section of text.split(/\n(?=#{2,3} )/)) {
      const h = section.match(/^(#{2,3}) (.*)$/m);
      if (h && h[1] === '##') parent = h[2];
      const heading = h ? (h[1] === '###' && parent ? `${parent} · ${h[2]}` : h[2]) : '';
      for (let i = 0; i < section.length; i += 2100) {
        const body = section.slice(i, i + 2400).trim();
        if (body.length > 40) chunks.push({title: title || path, heading, path, text: body});
      }
    }
  }
  writeFileSync(join(OUT, `${loc}.json`), JSON.stringify(chunks));
  console.log(`chat index ${loc}: ${chunks.length} chunks`);
}
