import {useId, type ReactNode} from 'react';

/**
 * Small SVG engine for the flow diagrams of the docs: boxes, groups and arrows
 * drawn in the site style (same palette as PipelineFlow and ArchitectureV2),
 * readable in light and dark mode. Every diagram is a plain object (see diagrams.tsx).
 */

export const TONES = {
  src: '#6b7280',
  neon: '#0f766e',
  kafka: '#0891b2',
  airflow: '#2563eb',
  bronze: '#b45309',
  silver: '#64748b',
  gold: '#ca8a04',
  out: '#5b45e0',
  aws: '#e8590c',
  ok: '#16a34a',
  bad: '#dc2626',
} as const;
export type Tone = keyof typeof TONES;

export type FlowNode = {
  id: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  lines?: string[];
  tone?: Tone;
  /** Filled pill with the title only (no header strip). */
  chip?: boolean;
  /** Not drawn: only an anchor for arrows (e.g. a whole group). */
  ghost?: boolean;
};

type Side = 'l' | 'r' | 't' | 'b';

export type FlowEdge = {
  from: string;
  to: string;
  fs?: Side;
  ts?: Side;
  /** Position along the side, 0..1 (default 0.5). */
  fo?: number;
  to_?: number;
  label?: string;
  dashed?: boolean;
  tone?: Tone;
  arrow?: boolean;
  /** x of the vertical segment of an r->l elbow, or y of the horizontal one of a b->t elbow. */
  mid?: number;
  lx?: number;
  ly?: number;
};

export type FlowGroup = {x: number; y: number; w: number; h: number; label?: string; tone?: Tone; solid?: boolean};
export type FlowBand = {x: number; w: number; y?: number; label: string; tone?: Tone};
export type FlowNote = {x: number; y: number; text: string; tone?: Tone; anchor?: 'start' | 'middle' | 'end'; bold?: boolean; size?: number};

export type FlowSpec = {
  width: number;
  height: number;
  title: string;
  nodes: FlowNode[];
  edges?: FlowEdge[];
  groups?: FlowGroup[];
  bands?: FlowBand[];
  notes?: FlowNote[];
};

const HEADER = 26;
const LINE = 16;

function size(n: FlowNode): {w: number; h: number} {
  const textW = Math.max(n.title.length * (n.chip ? 7.1 : 7.6), ...(n.lines ?? []).map((l) => l.length * 6.6));
  const w = n.w ?? Math.ceil(textW + 24);
  const h = n.h ?? (n.chip || !n.lines?.length ? 32 : HEADER + 10 + n.lines.length * LINE);
  return {w, h};
}

function anchor(n: FlowNode, side: Side, at = 0.5): [number, number] {
  const {w, h} = size(n);
  if (side === 'l') return [n.x, n.y + h * at];
  if (side === 'r') return [n.x + w, n.y + h * at];
  if (side === 't') return [n.x + w * at, n.y];
  return [n.x + w * at, n.y + h];
}

function route(e: FlowEdge, a: FlowNode, b: FlowNode): [number, number][] {
  const fs = e.fs ?? 'r';
  const ts = e.ts ?? 'l';
  const p1 = anchor(a, fs, e.fo);
  const p2 = anchor(b, ts, e.to_);
  const horiz = (s: Side) => s === 'l' || s === 'r';
  if (horiz(fs) && horiz(ts)) {
    if (Math.abs(p1[1] - p2[1]) < 1) return [p1, p2];
    const mx = e.mid ?? (p1[0] + p2[0]) / 2;
    return [p1, [mx, p1[1]], [mx, p2[1]], p2];
  }
  if (!horiz(fs) && !horiz(ts)) {
    if (Math.abs(p1[0] - p2[0]) < 1) return [p1, p2];
    const my = e.mid ?? (p1[1] + p2[1]) / 2;
    return [p1, [p1[0], my], [p2[0], my], p2];
  }
  if (horiz(fs)) return [p1, [p2[0], p1[1]], p2];
  return [p1, [p1[0], p2[1]], p2];
}

function labelPos(pts: [number, number][]): {x: number; y: number; anchor: 'middle' | 'start'} {
  let best = 0;
  let len = -1;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    if (l > len) {
      len = l;
      best = i;
    }
  }
  const [x1, y1] = pts[best];
  const [x2, y2] = pts[best + 1];
  if (Math.abs(y1 - y2) < 1) return {x: (x1 + x2) / 2, y: y1 - 6, anchor: 'middle'};
  return {x: x1 + 7, y: (y1 + y2) / 2 + 4, anchor: 'start'};
}

const halo = {
  stroke: 'var(--ifm-background-color)',
  strokeWidth: 4,
  paintOrder: 'stroke' as const,
  strokeLinejoin: 'round' as const,
};

function Node({n}: {n: FlowNode}): ReactNode {
  const {w, h} = size(n);
  const c = TONES[n.tone ?? 'src'];
  if (n.ghost) return null;
  if (n.chip || !n.lines?.length) {
    return (
      <g>
        <rect x={n.x} y={n.y} width={w} height={h} rx={9} fill={c} fillOpacity={0.12} stroke={c} strokeWidth={1.6} />
        <text x={n.x + w / 2} y={n.y + h / 2 + 4.5} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={c}>
          {n.title}
        </text>
      </g>
    );
  }
  return (
    <g>
      <rect x={n.x} y={n.y} width={w} height={h} rx={10} fill="var(--ifm-background-surface-color, #fff)" stroke={c} strokeWidth={1.8} />
      <path d={`M${n.x} ${n.y + HEADER} V${n.y + 10} a10 10 0 0 1 10 -10 H${n.x + w - 10} a10 10 0 0 1 10 10 V${n.y + HEADER} Z`} fill={c} />
      <text x={n.x + w / 2} y={n.y + 17.5} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="#fff">
        {n.title}
      </text>
      {n.lines.map((t, i) => (
        <text key={i} x={n.x + 11} y={n.y + HEADER + 16 + i * LINE} fontSize={11.5} fill="currentColor">
          {t}
        </text>
      ))}
    </g>
  );
}

export function Flow({spec}: {spec: FlowSpec}): ReactNode {
  const uid = useId().replace(/:/g, '');
  const byId = Object.fromEntries(spec.nodes.map((n) => [n.id, n]));
  const tonesUsed = Array.from(new Set(['src', ...(spec.edges ?? []).map((e) => e.tone ?? 'src')])) as Tone[];
  return (
    <div style={{overflowX: 'auto', margin: '1.5rem 0'}}>
      <svg
        viewBox={`0 0 ${spec.width} ${spec.height}`}
        style={{minWidth: Math.min(spec.width, 760), width: '100%', maxWidth: spec.width * 1.15, display: 'block', margin: '0 auto', fontFamily: 'var(--ifm-font-family-base)'}}
        role="img"
        aria-label={spec.title}>
        <title>{spec.title}</title>
        <defs>
          {tonesUsed.map((t) => (
            <marker key={t} id={`${uid}-${t}`} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10z" fill={t === 'src' ? 'currentColor' : TONES[t]} fillOpacity={t === 'src' ? 0.65 : 1} />
            </marker>
          ))}
        </defs>
        {(spec.bands ?? []).map((b) => {
          const c = TONES[b.tone ?? 'out'];
          return (
            <g key={b.label + b.x}>
              <rect x={b.x} y={b.y ?? 6} width={b.w} height={26} rx={13} fill={c} fillOpacity={0.12} />
              <text x={b.x + b.w / 2} y={(b.y ?? 6) + 17.5} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={c}>
                {b.label}
              </text>
            </g>
          );
        })}
        {(spec.groups ?? []).map((g, i) => {
          const c = TONES[g.tone ?? 'src'];
          return (
            <g key={`g${i}`}>
              <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={14} fill={c} fillOpacity={0.05} stroke={c} strokeOpacity={0.55} strokeDasharray={g.solid ? undefined : '6 5'} strokeWidth={1.4} />
              {g.label && (
                <text x={g.x + 12} y={g.y + 18} fontSize={12} fontWeight={700} fill={c}>
                  {g.label}
                </text>
              )}
            </g>
          );
        })}
        {(spec.edges ?? []).map((e, i) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;
          const pts = route(e, a, b);
          const tone = e.tone ?? 'src';
          const color = tone === 'src' ? 'currentColor' : TONES[tone];
          const lp = labelPos(pts);
          return (
            <g key={`e${i}`}>
              <path
                d={`M${pts.map((p) => p.join(' ')).join(' L')}`}
                fill="none"
                stroke={color}
                strokeOpacity={tone === 'src' ? 0.55 : 0.95}
                strokeWidth={1.8}
                strokeDasharray={e.dashed ? '6 4' : undefined}
                strokeLinejoin="round"
                markerEnd={e.arrow === false ? undefined : `url(#${uid}-${tone})`}
              />
              {e.label && (
                <text x={e.lx ?? lp.x} y={e.ly ?? lp.y} textAnchor={e.lx !== undefined ? 'middle' : lp.anchor} fontSize={11} fontWeight={600} fill={color} fillOpacity={tone === 'src' ? 0.8 : 1} {...halo}>
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {spec.nodes.map((n) => (
          <Node key={n.id} n={n} />
        ))}
        {(spec.notes ?? []).map((n, i) => (
          <text
            key={`n${i}`}
            x={n.x}
            y={n.y}
            textAnchor={n.anchor ?? 'start'}
            fontSize={n.size ?? 11.5}
            fontWeight={n.bold ? 700 : 500}
            fill={n.tone ? TONES[n.tone] : 'currentColor'}
            fillOpacity={n.tone ? 1 : 0.75}>
            {n.text}
          </text>
        ))}
      </svg>
    </div>
  );
}
