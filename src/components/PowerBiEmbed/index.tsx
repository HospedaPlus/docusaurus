import type {ReactNode} from 'react';

const SRC =
  'https://app.powerbi.com/view?r=eyJrIjoiMmQ0MzllYTYtYTYwZS00ZTgyLWJhMzMtNTA3ZGIyY2ZiNTkxIiwidCI6ImE5MGZmMGVjLWY4ZjktNGQ5Mi05NDI0LTYxOTFlNDA3ZDM2OCIsImMiOjR9';

/** Power BI report published to the web: anyone can see it without signing in. */
export default function PowerBiEmbed(): ReactNode {
  return (
    <div style={{position: 'relative', width: '100%', aspectRatio: '16 / 9', margin: '1rem 0 1.5rem'}}>
      <iframe
        title="HospedaPlus_Revenue"
        src={SRC}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8}}
        allowFullScreen
      />
    </div>
  );
}
