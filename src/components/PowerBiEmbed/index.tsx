import type {ReactNode} from 'react';

const SRC =
  'https://app.powerbi.com/reportEmbed?reportId=9995c244-7e38-4982-aa98-dbe82347573f&autoAuth=true&ctid=bab0b679-bd5f-4fe8-b516-c6b8b317c782&actionBarEnabled=true';

/** Secure Power BI embed: viewers must sign in with an account that has access to the report. */
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
