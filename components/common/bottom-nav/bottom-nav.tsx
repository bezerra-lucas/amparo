'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

type BottomNavIcon =
  | 'dashboard'
  | 'shift'
  | 'residents'
  | 'medications'
  | 'schedule';

export type BottomNavItem = {
  href: string;
  label: 'dashboard' | 'shift' | 'residents' | 'medications' | 'schedule';
  icon: BottomNavIcon;
};

export const defaultBottomNavItems: BottomNavItem[] = [
  { href: '/dashboard', label: 'dashboard', icon: 'dashboard' },
  { href: '/shift', label: 'shift', icon: 'shift' },
  { href: '/residents', label: 'residents', icon: 'residents' },
  { href: '/medications', label: 'medications', icon: 'medications' },
  { href: '/schedule', label: 'schedule', icon: 'schedule' }
];

const MAX_BOTTOM_NAV_ITEMS = 5;

function BottomNavIcon({ icon }: { icon: BottomNavIcon }) {
  const iconClass = 'h-5 w-5 shrink-0 text-brand-700';

  if (icon === 'dashboard') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className={iconClass}>
        <path
          d="M4 4H10V10H4V4ZM14 4H20V8H14V4ZM14 12H20V20H14V12ZM4 14H10V20H4V14Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === 'shift') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className={iconClass}>
        <path
          d="M12 6V12L16 14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (icon === 'residents') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className={iconClass}>
        <path
          d="M16 10C17.6569 10 19 8.65685 19 7C19 5.34315 17.6569 4 16 4C14.3431 4 13 5.34315 13 7C13 8.65685 14.3431 10 16 10Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M3.5 19.5C3.5 16.4624 5.96243 14 9 14H9.5C12.5376 14 15 16.4624 15 19.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M13.5 19.5C13.5 17.0147 15.5147 15 18 15"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === 'medications') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className={iconClass}>
        <path
          d="M8 5L19 16M6.5 15.5L15.5 6.5C16.8807 5.11929 19.1193 5.11929 20.5 6.5V6.5C21.8807 7.88071 21.8807 10.1193 20.5 11.5L11.5 20.5C10.1193 21.8807 7.88071 21.8807 6.5 20.5V20.5C5.11929 19.1193 5.11929 16.8807 6.5 15.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={iconClass}>
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 3V7M16 3V7M4 10H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BottomNav({
  items = defaultBottomNavItems
}: {
  items?: BottomNavItem[];
}) {
  const t = useTranslations('nav');
  const c = useTranslations('common');
  const visibleItems = items.slice(0, MAX_BOTTOM_NAV_ITEMS);

  return (
    <nav
      aria-label={c('appNavAriaLabel')}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line/80 bg-canvas/95 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] pt-2 backdrop-blur sm:hidden"
    >
      <ul
        className="mx-auto grid w-full max-w-6xl gap-1 px-2"
        style={{
          gridTemplateColumns: `repeat(${visibleItems.length}, minmax(0, 1fr))`
        }}
      >
        {visibleItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-medium text-ink-muted transition-colors hover:bg-brand-50/70 hover:text-brand-800"
            >
              <BottomNavIcon icon={item.icon} />
              <span>{t(item.label)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
