import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { PageHeader } from '@/components/common/page-header/page-header';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';

export default async function DashboardPage() {
  const t = await getTranslations('pages.dashboard');
  const s = await getTranslations('pages.dashboard.sections');
  const c = await getTranslations('common');
  const nav = await getTranslations('nav');
  const uiButtons = await getTranslations('ui.buttons');
  const uiBadges = await getTranslations('ui.badges');
  const samples = await getTranslations('ui.samples');
  const bpAlerts = await getTranslations('blueprints.dashboard.alerts');
  const bpToday = await getTranslations('blueprints.dashboard.today');

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <section>
        <h2>{c('navigation')}</h2>
        <ol className="space-y-1">
          <li>
            <Link className="underline" href="/residents">
              {nav('residents')}
            </Link>
          </li>
          <li>
            <Link className="underline" href="/medications">
              {nav('medications')}
            </Link>
          </li>
          <li>
            <Link className="underline" href="/schedule">
              {nav('schedule')}
            </Link>
          </li>
          <li>
            <Link className="underline" href="/admin/users">
              {nav('adminUsers')}
            </Link>
          </li>
          <li>
            <Link className="underline" href="/admin/auditoria">
              {nav('adminAudit')}
            </Link>
          </li>
        </ol>
      </section>

      <section>
        <h2>{s('alerts')}</h2>
        <div className="grid gap-3">
          <Card className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <strong>{bpAlerts('lowStock.title')}</strong>
              <Badge variant="warning">{uiBadges('alert')}</Badge>
            </div>
            <p>
              {bpAlerts('lowStock.body', {
                med: samples('med1')
              })}
            </p>
          </Card>
          <Card className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <strong>{bpAlerts('pendingChecks.title')}</strong>
              <Badge variant="danger">{uiBadges('late')}</Badge>
            </div>
            <p>
              {bpAlerts('pendingChecks.body', {
                time: samples('time0800'),
                count: 2
              })}
            </p>
          </Card>
          <Card className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <strong>{bpAlerts('billing.title')}</strong>
              <Badge variant="muted">{uiBadges('info')}</Badge>
            </div>
            <p>
              {bpAlerts('billing.body', {
                count: 2
              })}
            </p>
          </Card>
        </div>
      </section>
      <section>
        <h2>{s('today')}</h2>
        <Card className="space-y-2">
          <p>{bpToday('body1')}</p>
          <p>{bpToday('body2')}</p>
        </Card>
      </section>
      <section>
        <h2>{s('quickActions')}</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/residents">
            <Button>{uiButtons('open')}</Button>
          </Link>
          <Link href="/admin/auditoria">
            <Button>{nav('adminAudit')}</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
