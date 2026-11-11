import {useEffect, useMemo, useRef, useState, type ReactNode, type RefObject} from 'react';
import clsx from 'clsx';
import Icon from '@site/src/components/Icon';
import type {BookingStrings} from './strings';
import styles from './styles.module.css';

export const MAX_GUESTS = 10;

/** Closes a popover on a click outside it or on Escape. */
function useDismiss(open: boolean, box: RefObject<HTMLDivElement | null>, close: () => void): void {
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, box, close]);
}

// ---------- dates (ISO yyyy-mm-dd, no time zone surprises) ----------

export function isoOf(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return isoOf(d);
}

function monthDays(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1, 12);
  const lead = (first.getDay() + 6) % 7; // weeks start on Monday
  const total = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array.from({length: lead}, () => null);
  for (let d = 1; d <= total; d += 1) cells.push(isoOf(new Date(year, month, d, 12)));
  return cells;
}

function weekdayNames(locale: string): string[] {
  const monday = new Date(2026, 10, 2, 12); // a Monday
  return Array.from({length: 7}, (_, i) =>
    new Date(monday.getTime() + i * 86_400_000).toLocaleDateString(locale, {weekday: 'short'}).replace('.', ''),
  );
}

function shortDate(iso: string, locale: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(locale, {weekday: 'short', day: 'numeric', month: 'short'});
}

/**
 * Check-in and check-out fields that open one calendar in the site style.
 * The first click picks the arrival, the second the departure; the nights in between are highlighted.
 */
export function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  s,
  locale,
}: {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  s: BookingStrings;
  locale: string;
}): ReactNode {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'in' | 'out'>('in');
  const [hover, setHover] = useState<string | null>(null);
  const start = new Date(`${checkIn}T12:00:00`);
  const [view, setView] = useState({y: start.getFullYear(), m: start.getMonth()});
  const box = useRef<HTMLDivElement>(null);
  const close = useMemo(() => () => setOpen(false), []);
  useDismiss(open, box, close);

  const today = isoOf(new Date());
  const days = weekdayNames(locale);
  const months = [view, view.m === 11 ? {y: view.y + 1, m: 0} : {y: view.y, m: view.m + 1}];
  const rangeEnd = mode === 'out' && hover && hover > checkIn ? hover : checkOut;

  const openAt = (which: 'in' | 'out') => {
    setMode(which);
    setView({y: start.getFullYear(), m: start.getMonth()});
    setOpen(true);
  };
  const shift = (n: number) => {
    const d = new Date(view.y, view.m + n, 1);
    setView({y: d.getFullYear(), m: d.getMonth()});
  };
  const pick = (iso: string) => {
    if (mode === 'in' || iso <= checkIn) {
      onChange(iso, addDays(iso, 1)); // one night until the departure is chosen
      setMode('out');
      return;
    }
    onChange(checkIn, iso);
    setOpen(false);
  };

  const field = (which: 'in' | 'out') => (
    <button
      type="button"
      className={clsx(styles.searchField, styles.pickerButton, open && mode === which && styles.fieldActive)}
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={() => openAt(which)}>
      <Icon name="calendar" size={18} />
      <span>
        <small>{which === 'in' ? s.checkIn : s.checkOut}</small>
        <strong>{shortDate(which === 'in' ? checkIn : checkOut, locale)}</strong>
      </span>
    </button>
  );

  return (
    <div className={clsx(styles.picker, styles.datePicker)} ref={box}>
      {field('in')}
      {field('out')}
      {open && (
        <div className={clsx(styles.popover, styles.calendarPopover)} role="dialog" aria-label={`${s.checkIn} / ${s.checkOut}`}>
          <p className={styles.calendarHint}>{mode === 'in' ? s.pickCheckIn : s.pickCheckOut}</p>
          <div className={styles.calendarMonths}>
            {months.map(({y, m}, i) => (
              <div key={`${y}-${m}`} className={styles.calendarMonth}>
                <div className={styles.calendarHead}>
                  {i === 0 ? (
                    <button type="button" className={styles.calendarNav} aria-label={s.prevMonth} onClick={() => shift(-1)}>
                      ‹
                    </button>
                  ) : (
                    <span />
                  )}
                  <strong>{new Date(y, m, 1, 12).toLocaleDateString(locale, {month: 'long', year: 'numeric'})}</strong>
                  {i === months.length - 1 ? (
                    <button type="button" className={styles.calendarNav} aria-label={s.nextMonth} onClick={() => shift(1)}>
                      ›
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
                <div className={styles.calendarGrid}>
                  {days.map((d) => (
                    <span key={d} className={styles.calendarDow}>
                      {d}
                    </span>
                  ))}
                  {monthDays(y, m).map((iso, k) =>
                    iso === null ? (
                      <span key={`e${k}`} />
                    ) : (
                      <button
                        type="button"
                        key={iso}
                        disabled={iso < today}
                        onMouseEnter={() => setHover(iso)}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => pick(iso)}
                        className={clsx(
                          styles.calendarDay,
                          iso === today && styles.calendarToday,
                          iso > checkIn && iso < rangeEnd && styles.calendarInRange,
                          (iso === checkIn || iso === rangeEnd) && styles.calendarEdge,
                        )}>
                        {Number(iso.slice(8))}
                      </button>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Counter({
  label,
  hint,
  value,
  min,
  max,
  onChange,
  s,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  s: BookingStrings;
}): ReactNode {
  return (
    <div className={styles.counterRow}>
      <span>
        <strong>{label}</strong>
        <small>{hint}</small>
      </span>
      <div className={styles.guestCounter}>
        <button type="button" aria-label={`${s.remove}: ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          aria-label={label}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const n = Number.parseInt(e.target.value, 10);
            onChange(Number.isNaN(n) ? min : Math.min(max, Math.max(min, n)));
          }}
        />
        <button type="button" aria-label={`${s.add}: ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
          +
        </button>
      </div>
    </div>
  );
}

/** Guests selector: adults and children with + / − buttons, 10 people at most. */
export function GuestPicker({
  adults,
  children,
  onChange,
  s,
}: {
  adults: number;
  children: number;
  onChange: (adults: number, children: number) => void;
  s: BookingStrings;
}): ReactNode {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const close = useMemo(() => () => setOpen(false), []);
  useDismiss(open, box, close);
  const summary = `${adults} ${s.adultsShort}${children > 0 ? ` · ${children} ${s.children.toLowerCase()}` : ''}`;

  return (
    <div className={clsx(styles.picker, styles.guestPicker)} ref={box}>
      <button
        type="button"
        className={clsx(styles.searchField, styles.pickerButton, open && styles.fieldActive)}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}>
        <Icon name="users" size={18} />
        <span>
          <small>{s.guests}</small>
          <strong>{summary}</strong>
        </span>
        <span className={clsx(styles.chevron, open && styles.chevronOpen)}>⌄</span>
      </button>
      {open && (
        <div className={clsx(styles.popover, styles.guestPopover)} role="dialog" aria-label={s.guests}>
          <Counter label={s.adults} hint={s.adultsHint} value={adults} min={1} max={MAX_GUESTS - children} onChange={(n) => onChange(n, children)} s={s} />
          <Counter label={s.children} hint={s.childrenHint} value={children} min={0} max={MAX_GUESTS - adults} onChange={(n) => onChange(adults, n)} s={s} />
          <div className={styles.guestFoot}>
            <small>
              {adults + children}/{MAX_GUESTS} · {s.maxGuests}
            </small>
            <button type="button" className={styles.primary} onClick={() => setOpen(false)}>
              {s.done}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
