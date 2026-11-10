import {useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import Icon from '@site/src/components/Icon';
import {HOTELS} from './hotels';
import styles from './styles.module.css';

const COUNTRY_ORDER = ['CO', 'MX', 'BR', 'ES', 'PT'];

function countryName(code: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], {type: 'region'}).of(code) ?? code;
  } catch {
    return code;
  }
}

function norm(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Destination selector with every HospedaPlus hotel, grouped by country and searchable. */
export default function DestinationPicker({
  value,
  onChange,
  label,
  placeholder,
  empty,
  locale,
}: {
  value: string;
  onChange: (code: string) => void;
  label: string;
  placeholder: string;
  empty: string;
  locale: string;
}): ReactNode {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const selected = HOTELS.find((h) => h.code === value) ?? HOTELS[0];

  useEffect(() => {
    if (!open) return undefined;
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const groups = useMemo(() => {
    const q = norm(query.trim());
    return COUNTRY_ORDER.map((c) => ({
      country: c,
      name: countryName(c, locale),
      hotels: HOTELS.filter(
        (h) => h.country === c && (!q || norm(`${h.name} ${h.city} ${countryName(c, locale)}`).includes(q)),
      ),
    })).filter((g) => g.hotels.length > 0);
  }, [query, locale]);

  return (
    <div className={styles.picker} ref={box}>
      <button
        type="button"
        className={clsx(styles.searchField, styles.pickerButton)}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}>
        <Icon name="building" size={18} />
        <span>
          <small>{label}</small>
          <strong>
            {selected.city}, {countryName(selected.country, locale)}
          </strong>
        </span>
        <span className={clsx(styles.chevron, open && styles.chevronOpen)}>⌄</span>
      </button>
      {open && (
        <div className={styles.popover} role="listbox">
          <input
            autoFocus
            className={styles.pickerSearch}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={styles.pickerList}>
            {groups.length === 0 && <p className={styles.pickerEmpty}>{empty}</p>}
            {groups.map((g) => (
              <div key={g.country}>
                <div className={styles.pickerGroup}>
                  {g.name} · {g.hotels.length}
                </div>
                {g.hotels.map((h) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected={h.code === value}
                    key={h.code}
                    className={clsx(styles.pickerOption, h.code === value && styles.pickerActive)}
                    onClick={() => {
                      onChange(h.code);
                      setOpen(false);
                      setQuery('');
                    }}>
                    <span>
                      <strong>{h.name.replace('HospedaPlus ', '')}</strong>
                      <small>
                        {h.city} · {h.code}
                      </small>
                    </span>
                    {h.code === value && <span className={styles.tick}>✓</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
