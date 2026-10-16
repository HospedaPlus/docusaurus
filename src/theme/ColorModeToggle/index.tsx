import {memo, type ReactNode} from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/ColorModeToggle';
import styles from './styles.module.css';

function getModeLabel(dark: boolean): string {
  return dark
    ? translate({id: 'theme.colorToggle.ariaLabel.mode.dark', message: 'dark mode'})
    : translate({id: 'theme.colorToggle.ariaLabel.mode.light', message: 'light mode'});
}

function SunIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </svg>
  );
}

function MoonIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" />
    </svg>
  );
}

/**
 * Light / dark switch for the navbar: a track with a sun and a moon and a knob
 * that slides to the active mode. The knob position comes from the
 * `data-theme` attribute, so it is right before React hydrates.
 */
function ColorModeToggle({className, buttonClassName, value, onChange}: Props): ReactNode {
  const isBrowser = useIsBrowser();
  const isDark = value === 'dark';
  return (
    <div className={clsx(styles.toggle, className)}>
      <button
        className={clsx('clean-btn', styles.switch, buttonClassName)}
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={() => onChange(isDark ? 'light' : 'dark')}
        disabled={!isBrowser}
        title={getModeLabel(isDark)}
        aria-label={translate(
          {id: 'theme.colorToggle.ariaLabel', message: 'Switch between dark and light mode (currently {mode})'},
          {mode: getModeLabel(isDark)},
        )}>
        <span className={clsx(styles.side, styles.sideSun)}>
          <SunIcon />
        </span>
        <span className={clsx(styles.side, styles.sideMoon)}>
          <MoonIcon />
        </span>
        <span className={styles.knob}>
          <span className={styles.knobSun}>
            <SunIcon />
          </span>
          <span className={styles.knobMoon}>
            <MoonIcon />
          </span>
        </span>
      </button>
    </div>
  );
}

export default memo(ColorModeToggle);
