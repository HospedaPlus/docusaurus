import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

const T: Record<string, {open: string; download: string; edit: string; full: string}> = {
  en: {open: 'Open full size', download: 'Download image (PNG)', edit: 'Open in draw.io', full: 'Click the image to open it full size.'},
  es: {open: 'Abrir en tamaño completo', download: 'Descargar imagen (PNG)', edit: 'Abrir en draw.io', full: 'Haz clic en la imagen para verla en tamaño completo.'},
  pt: {open: 'Abrir em tamanho real', download: 'Baixar imagem (PNG)', edit: 'Abrir no draw.io', full: 'Clique na imagem para abri-la em tamanho real.'},
  fr: {open: 'Ouvrir en taille réelle', download: "Télécharger l'image (PNG)", edit: 'Ouvrir dans draw.io', full: "Cliquez sur l'image pour l'ouvrir en taille réelle."},
  de: {open: 'In voller Größe öffnen', download: 'Bild herunterladen (PNG)', edit: 'In draw.io öffnen', full: 'Klicken Sie auf das Bild, um es in voller Größe zu öffnen.'},
};

export default function DiagramFigure({src, alt, editUrl, fileName}: {src: string; alt: string; editUrl?: string; fileName: string}): ReactNode {
  const {i18n} = useDocusaurusContext();
  const t = T[i18n.currentLocale] ?? T.en;
  const url = useBaseUrl(src);
  const btn = {display: 'inline-block', padding: '0.35rem 0.8rem', marginRight: '0.5rem', marginBottom: '0.5rem',
    borderRadius: 8, border: '1px solid var(--ifm-color-primary)', fontWeight: 600, fontSize: '0.9rem'};
  return (
    <figure style={{margin: '1.5rem 0'}}>
      <div style={{marginBottom: '0.75rem'}}>
        {editUrl && <a style={btn} href={editUrl} target="_blank" rel="noopener noreferrer">{t.edit} ↗</a>}
        <a style={btn} href={url} download={fileName}>{t.download} ⬇</a>
        <a style={btn} href={url} target="_blank" rel="noopener noreferrer">{t.open} ↗</a>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img src={url} alt={alt} loading="lazy" style={{width: '100%', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8}} />
      </a>
      <figcaption style={{fontSize: '0.85rem', opacity: 0.75}}>{t.full}</figcaption>
    </figure>
  );
}
