'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet/sheet';
import { cn } from '@/lib/cn';

type NavIcon =
  | 'shift'
  | 'dashboard'
  | 'financial'
  | 'residents'
  | 'medications'
  | 'schedule'
  | 'adminUsers'
  | 'adminAudit';

const navLinks = [
  { href: '/shift', label: 'shift', icon: 'shift' },
  { href: '/dashboard', label: 'dashboard', icon: 'dashboard' },
  { href: '/financial', label: 'financial', icon: 'financial' },
  { href: '/residents', label: 'residents', icon: 'residents' },
  { href: '/medications', label: 'medications', icon: 'medications' },
  { href: '/schedule', label: 'schedule', icon: 'schedule' },
  { href: '/admin/users', label: 'adminUsers', icon: 'adminUsers' },
  { href: '/admin/auditoria', label: 'adminAudit', icon: 'adminAudit' }
] as const;

type NavLabel = (typeof navLinks)[number]['label'];

type NavLinksListProps = {
  className: string;
  linkClassName?: string;
  onNavigate?: () => void;
  t: (label: NavLabel) => string;
};

function NavLinksList({
  className,
  linkClassName,
  onNavigate,
  t
}: NavLinksListProps) {
  return (
    <ul className={className}>
      {navLinks.map((item) => (
        <li key={item.href}>
          <Link
            className={cn(
              'inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-canvas px-3 text-sm font-medium text-ink-muted',
              'hover:border-brand-300 hover:bg-brand-50/70 hover:text-brand-800',
              linkClassName
            )}
            href={item.href}
            onClick={onNavigate}
          >
            <NavMenuIcon icon={item.icon} />
            <span>{t(item.label)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function NavMenuIcon({ icon }: { icon: NavIcon }) {
  const iconClass = 'h-4 w-4 shrink-0 text-brand-700';

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

  if (icon === 'financial') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className={iconClass}>
        <rect
          x="3"
          y="6"
          width="18"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M3 10H21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="16" cy="14" r="1.3" fill="currentColor" />
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

  if (icon === 'schedule') {
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

  if (icon === 'adminUsers') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className={iconClass}>
        <path
          d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M6 19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M20 10V14M18 12H22"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === 'adminAudit') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className={iconClass}>
        <path
          d="M12 8V13L15 15"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M15 4H20V9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={iconClass}>
      <path
        d="M12 3L21 7V12C21 16.9706 17.9706 21.5 12 22C6.02944 21.5 3 16.9706 3 12V7L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 10V14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

export function AppNav() {
  const a = useTranslations('app');
  const t = useTranslations('nav');
  const c = useTranslations('common');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="group inline-flex w-fit items-center gap-3 rounded-full border border-brand-200 bg-brand-50/70 px-3 py-1.5"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-canvas shadow-panel">
            <span className="h-3 w-3 rounded-full bg-brand-600 shadow-[0_0_0_6px_rgb(var(--brand-200)/0.45)] transition-transform duration-300 group-hover:scale-110" />
          </span>
          <span className="font-heading text-lg leading-none text-brand-800">
            {a('name')}
          </span>
        </Link>

        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              aria-label={c('openNavMenu')}
              className="h-10 w-10 rounded-xl p-0 shadow-panel sm:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="h-5 w-5"
              >
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-80 max-w-[85vw] border-l border-line bg-canvas px-4 pb-6 pt-4 sm:hidden"
          >
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <SheetTitle className="font-heading text-lg text-ink">
                {c('menuTitle')}
              </SheetTitle>
              <SheetDescription className="sr-only">
                {c('mobileMenuDescription')}
              </SheetDescription>

              <Button
                type="button"
                variant="ghost"
                aria-label={c('closeNavMenu')}
                className="h-9 w-9 rounded-lg border border-line p-0 text-ink-muted hover:border-brand-300 hover:bg-brand-50/70 hover:text-brand-800"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="h-4 w-4"
                >
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
            </div>

            <nav aria-label={c('appNavAriaLabel')}>
              <NavLinksList
                className="flex flex-col gap-2"
                linkClassName="w-full justify-start rounded-2xl px-4 py-3 text-base"
                onNavigate={() => setIsMobileSidebarOpen(false)}
                t={t}
              />
            </nav>
          </SheetContent>
        </Sheet>

        <nav aria-label={c('appNavAriaLabel')} className="hidden sm:block">
          <NavLinksList className="flex flex-wrap gap-2" t={t} />
        </nav>
      </div>
    </>
  );
}
