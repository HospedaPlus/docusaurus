import {useMemo, useState, type FormEvent, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Icon from '@site/src/components/Icon';
import {bookingStrings, type BookingStrings} from './strings';
import {HOTELS} from './hotels';
import DestinationPicker from './DestinationPicker';
import styles from './styles.module.css';

/** Sample data only: prices in COP per night, as in the mock-up. */
const ROOMS = [
  {id: 'estandar', guests: 2, price: 320000, rating: 4.5, reviews: 214},
  {id: 'superior', guests: 3, price: 420000, rating: 4.7, reviews: 281},
  {id: 'deluxe', guests: 4, price: 560000, rating: 4.8, reviews: 326},
];
const GALLERY = ['deluxe', 'superior', 'estandar', 'hero'];
const VAT = 0.19;

type Guest = {firstName: string; lastName: string; email: string; phone: string; document: string; requests: string};
type Card = {name: string; number: string; expiry: string; cvv: string};

function useStrings(): {s: BookingStrings; locale: string} {
  const {i18n} = useDocusaurusContext();
  return {s: bookingStrings[i18n.currentLocale] ?? bookingStrings.en, locale: i18n.currentLocale};
}

function cop(value: number): string {
  return `$${Math.round(value).toLocaleString('es-CO')} COP`;
}

function nightsBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
}

function fmtDate(iso: string, locale: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(locale, {day: 'numeric', month: 'short', year: 'numeric'});
}

function Img({name, alt, className}: {name: string; alt: string; className?: string}): ReactNode {
  return <img src={useBaseUrl(`/img/booking/${name}.jpg`)} alt={alt} className={className} loading="lazy" />;
}

function Stepper({step, s}: {step: number; s: BookingStrings}): ReactNode {
  return (
    <ol className={styles.stepper}>
      {s.steps.map((label, i) => (
        <li key={label} className={clsx(i < step && styles.done, i === step && styles.current)}>
          <span className={styles.stepDot}>{i < step ? '✓' : i + 1}</span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  wide?: boolean;
}): ReactNode {
  return (
    <label className={clsx(styles.field, wide && styles.wide)}>
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(error && styles.invalid)}
        aria-invalid={Boolean(error)}
      />
      {error && <small className={styles.error}>{error}</small>}
    </label>
  );
}

export default function Booking(): ReactNode {
  const {s, locale} = useStrings();
  const [step, setStep] = useState(-1); // -1 = room list, 0..3 = the four steps
  const [roomId, setRoomId] = useState('deluxe');
  const [destination, setDestination] = useState<string>('HP-CO-002');
  const [checkIn, setCheckIn] = useState('2026-11-15');
  const [checkOut, setCheckOut] = useState('2026-11-18');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [photo, setPhoto] = useState(0);
  const [guest, setGuest] = useState<Guest>({firstName: '', lastName: '', email: '', phone: '', document: '', requests: ''});
  const [card, setCard] = useState<Card>({name: '', number: '', expiry: '', cvv: ''});
  const [tried, setTried] = useState(false);
  const [code, setCode] = useState('');
  const heroUrl = useBaseUrl('/img/booking/hero.jpg');

  const hotel = HOTELS.find((h) => h.code === destination) ?? HOTELS[4];
  const room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[2];
  const text = s.rooms.find((r) => r.id === roomId) ?? s.rooms[2];
  const nights = nightsBetween(checkIn, checkOut);
  const datesOk = nights > 0;
  const subtotal = room.price * Math.max(nights, 0);
  const taxes = subtotal * VAT;
  const total = subtotal + taxes;
  const gallery = useMemo(() => [roomId, ...GALLERY.filter((g) => g !== roomId)], [roomId]);

  const guestErrors: Partial<Record<keyof Guest, string>> = {};
  (['firstName', 'lastName', 'phone', 'document'] as const).forEach((k) => {
    if (!guest[k].trim()) guestErrors[k] = s.required;
  });
  if (!/^\S+@\S+\.\S+$/.test(guest.email)) guestErrors.email = guest.email ? s.invalidEmail : s.required;

  const cardErrors: Partial<Record<keyof Card, string>> = {};
  if (!card.name.trim()) cardErrors.name = s.required;
  if (card.number.replace(/\D/g, '').length < 12) cardErrors.number = s.required;
  if (!/^\d{2}\/\d{2}$/.test(card.expiry)) cardErrors.expiry = s.required;
  if (!/^\d{3,4}$/.test(card.cvv)) cardErrors.cvv = s.required;

  const go = (next: number) => {
    setTried(false);
    setStep(next);
    if (typeof window !== 'undefined') window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const submitGuest = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (Object.keys(guestErrors).length === 0) go(2);
  };

  const submitPayment = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (Object.keys(cardErrors).length === 0) {
      setCode(`HP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
      go(3);
    }
  };

  const reset = () => {
    setGuest({firstName: '', lastName: '', email: '', phone: '', document: '', requests: ''});
    setCard({name: '', number: '', expiry: '', cvv: ''});
    setPhoto(0);
    go(-1);
  };

  const summary = (
    <aside className={styles.summary}>
      <div className={styles.summaryCard}>
        <h3>{s.summary}</h3>
        <div className={styles.summaryRoom}>
          <Img name={roomId} alt={text.name} />
          <div>
            <strong>{text.name}</strong>
            <span>{hotel.name}</span>
            <span>
              {adults} {s.adultsShort}
              {children > 0 && ` + ${children} ${s.children.toLowerCase()}`} · {Math.max(nights, 0)} {s.nightsWord}
            </span>
            <span>
              {fmtDate(checkIn, locale)} → {fmtDate(checkOut, locale)}
            </span>
          </div>
        </div>
        <dl className={styles.lines}>
          <dt>
            {s.rate} ({Math.max(nights, 0)} {s.nightsWord})
          </dt>
          <dd>{cop(subtotal)}</dd>
          <dt>{s.taxes}</dt>
          <dd>{cop(taxes)}</dd>
        </dl>
        <div className={styles.total}>
          <span>{s.total}</span>
          <strong>{cop(total)}</strong>
        </div>
        {step === 0 && (
          <button type="button" className={styles.primary} disabled={!datesOk} onClick={() => go(1)}>
            {s.continueDetails}
          </button>
        )}
      </div>
      <ul className={styles.perks}>
        <li>
          <Icon name="shield" size={22} />
          <span>
            <strong>{s.secure}</strong>
            {s.secureText}
          </span>
        </li>
        <li>
          <Icon name="calendar" size={22} />
          <span>
            <strong>{s.flexible}</strong>
            {s.flexibleText}
          </span>
        </li>
        <li>
          <Icon name="message" size={22} />
          <span>
            <strong>{s.support}</strong>
            {s.supportText}
          </span>
        </li>
      </ul>
    </aside>
  );

  const stayFields = (
    <>
      <label className={styles.searchField}>
        <Icon name="calendar" size={18} />
        <span>
          <small>{s.checkIn}</small>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </span>
      </label>
      <label className={styles.searchField}>
        <Icon name="calendar" size={18} />
        <span>
          <small>{s.checkOut}</small>
          <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} />
        </span>
      </label>
    </>
  );

  if (step === -1) {
    return (
      <main className={styles.page}>
        <section className={styles.hero} style={{backgroundImage: `url(${heroUrl})`}}>
          <div className={styles.heroText}>
            <h1>
              {s.heroTitle1}
              <br />
              <span>{s.heroTitle2}</span>
            </h1>
            <p>{s.heroText}</p>
          </div>
          <form
            className={styles.search}
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById('rooms')?.scrollIntoView({behavior: 'smooth'});
            }}>
            <DestinationPicker value={destination} onChange={setDestination} label={s.destination} placeholder={s.searchHotel} empty={s.noHotels} locale={locale} />
            {stayFields}
            <label className={styles.searchField}>
              <Icon name="users" size={18} />
              <span>
                <small>{s.guests}</small>
                <select value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} {s.adultsShort}
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <button type="submit" className={styles.primary}>
              {s.search}
            </button>
          </form>
        </section>
        <p className={styles.notice}>{s.demoNotice}</p>
        <section id="rooms" className={styles.section}>
          <h2>{s.available}</h2>
          <div className={styles.cards}>
            {ROOMS.map((r) => {
              const t = s.rooms.find((x) => x.id === r.id)!;
              const fits = adults + children <= r.guests;
              return (
                <article key={r.id} className={clsx(styles.card, !fits && styles.dim)}>
                  <Img name={r.id} alt={t.name} />
                  <div className={styles.cardBody}>
                    <h3>{t.name}</h3>
                    <p className={styles.meta}>
                      <span>
                        <Icon name="user" size={15} /> {r.guests} {s.guestsN}
                      </span>
                      <span>
                        <Icon name="bed" size={15} /> {t.bed}
                      </span>
                    </p>
                    <div className={styles.cardFoot}>
                      <span>
                        <strong>{cop(r.price).replace(' COP', '')}</strong> COP / {s.perNight}
                      </span>
                      <button
                        type="button"
                        className={styles.secondary}
                        disabled={!fits}
                        onClick={() => {
                          setRoomId(r.id);
                          setPhoto(0);
                          go(0);
                        }}>
                        {s.viewDetail}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.flowHead}>
        <button type="button" className={styles.back} onClick={() => go(step <= 0 || step === 3 ? -1 : step - 1)}>
          ← {s.back}
        </button>
        <Stepper step={step} s={s} />
      </div>
      <p className={styles.notice}>{s.demoNotice}</p>

      {step === 0 && (
        <div className={styles.flow}>
          <div className={styles.main}>
            <div className={styles.detail}>
              <div className={styles.gallery}>
                <div className={styles.photo}>
                  <Img name={gallery[photo]} alt={text.name} />
                  <button type="button" className={clsx(styles.nav, styles.prev)} aria-label="prev" onClick={() => setPhoto((photo + gallery.length - 1) % gallery.length)}>
                    ‹
                  </button>
                  <button type="button" className={clsx(styles.nav, styles.next)} aria-label="next" onClick={() => setPhoto((photo + 1) % gallery.length)}>
                    ›
                  </button>
                  <span className={styles.counter}>
                    {photo + 1}/{gallery.length}
                  </span>
                </div>
                <div className={styles.thumbs}>
                  {gallery.map((g, i) => (
                    <button type="button" key={g} className={clsx(i === photo && styles.active)} onClick={() => setPhoto(i)}>
                      <Img name={g} alt="" />
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.info}>
                <h2>{text.name}</h2>
                <p className={styles.rating}>
                  ★ <strong>{room.rating}</strong> ({room.reviews} {s.reviews})
                </p>
                <p>{text.desc}</p>
                <ul className={styles.amenities}>
                  <li>
                    <Icon name="user" size={17} /> {room.guests} {s.guestsN}
                  </li>
                  <li>
                    <Icon name="bed" size={17} /> {text.bed}
                  </li>
                  {s.amenities.map((a) => (
                    <li key={a}>
                      <Icon name="zap" size={17} /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <h3>{s.chooseStay}</h3>
            <div className={styles.stay}>
              {stayFields}
              <span className={styles.nights}>
                {s.nights}: {Math.max(nights, 0)}
              </span>
            </div>
            {!datesOk && <p className={styles.error}>{s.dateInvalid}</p>}
            <h4>{s.guests}</h4>
            <div className={styles.stay}>
              <label className={styles.searchField}>
                <span>
                  <small>{s.adults}</small>
                  <select value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                    {Array.from({length: room.guests}, (_, i) => i + 1).map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </span>
              </label>
              <label className={styles.searchField}>
                <span>
                  <small>{s.children}</small>
                  <select value={children} onChange={(e) => setChildren(Number(e.target.value))}>
                    {Array.from({length: Math.max(room.guests - adults, 0) + 1}, (_, i) => i).map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </span>
              </label>
            </div>
          </div>
          {summary}
        </div>
      )}

      {step === 1 && (
        <div className={styles.flow}>
          <form className={styles.main} onSubmit={submitGuest} noValidate>
            <h2>{s.guestData}</h2>
            <div className={styles.form}>
              <Field label={s.firstName} value={guest.firstName} onChange={(v) => setGuest({...guest, firstName: v})} error={tried ? guestErrors.firstName : undefined} />
              <Field label={s.lastName} value={guest.lastName} onChange={(v) => setGuest({...guest, lastName: v})} error={tried ? guestErrors.lastName : undefined} />
              <Field label={s.email} type="email" placeholder="nombre@correo.com" value={guest.email} onChange={(v) => setGuest({...guest, email: v})} error={tried ? guestErrors.email : undefined} />
              <Field label={s.phone} type="tel" placeholder="+57 300 000 0000" value={guest.phone} onChange={(v) => setGuest({...guest, phone: v})} error={tried ? guestErrors.phone : undefined} />
              <Field label={s.document} value={guest.document} onChange={(v) => setGuest({...guest, document: v})} error={tried ? guestErrors.document : undefined} />
              <Field label={s.requests} value={guest.requests} onChange={(v) => setGuest({...guest, requests: v})} wide />
            </div>
            <button type="submit" className={styles.primary}>
              {s.continuePayment}
            </button>
          </form>
          {summary}
        </div>
      )}

      {step === 2 && (
        <div className={styles.flow}>
          <form className={styles.main} onSubmit={submitPayment} noValidate>
            <h2>{s.paymentTitle}</h2>
            <div className={styles.cardPreview}>
              <span>{s.card}</span>
              <strong>{card.number ? card.number : '•••• •••• •••• ••••'}</strong>
              <span>
                {card.name || s.cardName} · {card.expiry || 'MM/YY'}
              </span>
            </div>
            <div className={styles.form}>
              <Field label={s.cardName} value={card.name} onChange={(v) => setCard({...card, name: v})} error={tried ? cardErrors.name : undefined} wide />
              <Field
                label={s.cardNumber}
                placeholder="4242 4242 4242 4242"
                value={card.number}
                onChange={(v) => setCard({...card, number: v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')})}
                error={tried ? cardErrors.number : undefined}
                wide
              />
              <Field
                label={s.expiry}
                placeholder="12/28"
                value={card.expiry}
                onChange={(v) => {
                  const d = v.replace(/\D/g, '').slice(0, 4);
                  setCard({...card, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d});
                }}
                error={tried ? cardErrors.expiry : undefined}
              />
              <Field label={s.cvv} placeholder="123" value={card.cvv} onChange={(v) => setCard({...card, cvv: v.replace(/\D/g, '').slice(0, 4)})} error={tried ? cardErrors.cvv : undefined} />
            </div>
            <p className={styles.notice}>{s.paymentNotice}</p>
            <button type="submit" className={styles.primary}>
              {s.pay} {cop(total)}
            </button>
          </form>
          {summary}
        </div>
      )}

      {step === 3 && (
        <div className={styles.flow}>
          <div className={clsx(styles.main, styles.confirm)}>
            <div className={styles.check}>✓</div>
            <h2>{s.confirmedTitle}</h2>
            <p>
              {s.confirmedText} <strong>{guest.email}</strong>
            </p>
            <p className={styles.code}>
              {s.code}: <strong>{code}</strong>
            </p>
            <p>
              {guest.firstName} {guest.lastName} · {hotel.name}
            </p>
            <div className={styles.actions}>
              <button type="button" className={styles.primary} onClick={reset}>
                {s.newBooking}
              </button>
              <Link className={styles.secondary} to="/docs/pain-resolution">
                {s.dataDocs} →
              </Link>
            </div>
          </div>
          {summary}
        </div>
      )}
    </main>
  );
}

