'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function AppNav() {
  const t = useTranslations('nav');
  const c = useTranslations('common');

  return (
    <nav aria-label={c('appNavAriaLabel')}>
      <ul className="flex flex-wrap gap-3">
        <li>
          <Link className="underline" href="/shift">
            {t('shift')}
          </Link>
        </li>
        <li>
          <Link className="underline" href="/dashboard">
            {t('dashboard')}
          </Link>
        </li>
        <li>
          <Link className="underline" href="/residents">
            {t('residents')}
          </Link>
        </li>
        <li>
          <Link className="underline" href="/medications">
            {t('medications')}
          </Link>
        </li>
        <li>
          <Link className="underline" href="/schedule">
            {t('schedule')}
          </Link>
        </li>
        <li>
          <Link className="underline" href="/admin/users">
            {t('adminUsers')}
          </Link>
        </li>
        <li>
          <Link className="underline" href="/admin/auditoria">
            {t('adminAudit')}
          </Link>
        </li>
        <li>
          <Link className="underline" href="/access-pending">
            {t('accessPending')}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
