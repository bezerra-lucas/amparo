import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { PageHeader } from '@/components/common/page-header/page-header';
import { ResidentIdentity } from '@/components/common/resident-identity/resident-identity';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';

export default async function DashboardPage() {
  const t = await getTranslations('pages.dashboard');
  const s = await getTranslations('pages.dashboard.sections');
  const nav = await getTranslations('nav');
  const uiButtons = await getTranslations('ui.buttons');
  const uiBadges = await getTranslations('ui.badges');
  const uiOptions = await getTranslations('ui.options');
  const samples = await getTranslations('ui.samples');
  const bpAlerts = await getTranslations('blueprints.dashboard.alerts');
  const bpToday = await getTranslations('blueprints.dashboard.today');

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

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
        <div className="grid gap-3">
          <Card className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <strong>{bpToday('shift.title')}</strong>
              <Badge variant="muted">{samples('time0800')}</Badge>
            </div>
            <div className="grid gap-1 text-sm text-slate-800">
              <div>
                <strong>{bpToday('shift.labels.shift')}:</strong>{' '}
                {uiOptions('shiftDay')}
              </div>
              <div>
                <strong>{bpToday('shift.labels.lead')}:</strong>{' '}
                {samples('staff1')}
              </div>
              <div>
                <strong>{bpToday('shift.labels.team')}:</strong>{' '}
                {samples('staff2')}
              </div>
              <div>
                <strong>{bpToday('shift.labels.activeResidents')}:</strong> 18
              </div>
            </div>
          </Card>

          <Card className="space-y-2">
            <strong>{bpToday('mar.title')}</strong>
            <div className="grid gap-2">
              {[
                samples('time0800'),
                samples('time1400'),
                samples('time2000')
              ].map((time, idx) => (
                <Card key={time} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      <strong>{bpToday('mar.labels.time')}:</strong> {time}
                    </span>
                    <Badge variant={idx === 0 ? 'danger' : 'success'}>
                      {idx === 0 ? uiBadges('late') : uiBadges('info')}
                    </Badge>
                  </div>
                  <div className="grid gap-1 text-sm text-slate-800 sm:grid-cols-2">
                    <div>
                      <strong>{bpToday('mar.labels.pending')}:</strong>{' '}
                      {idx === 0 ? 6 : 0}
                    </div>
                    <div>
                      <strong>{bpToday('mar.labels.done')}:</strong>{' '}
                      {idx === 0 ? 2 : 8}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/residents">
                <Button>{nav('residents')}</Button>
              </Link>
            </div>
          </Card>

          <Card className="space-y-2">
            <strong>{bpToday('nursing.title')}</strong>
            <div className="grid gap-2 sm:grid-cols-2">
              <Card className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span>{bpToday('nursing.labels.day')}</span>
                  <Badge variant="success">
                    {bpToday('nursing.statuses.done')}
                  </Badge>
                </div>
                <p className="flex items-center gap-1 text-xs">
                  <ResidentIdentity
                    name={samples('resident1')}
                    size="md"
                    className="gap-1"
                  />
                  <span>- {samples('staff1')}</span>
                </p>
              </Card>
              <Card className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span>{bpToday('nursing.labels.night')}</span>
                  <Badge variant="warning">
                    {bpToday('nursing.statuses.missing')}
                  </Badge>
                </div>
                <p className="text-xs">
                  <ResidentIdentity
                    name={samples('resident2')}
                    size="md"
                    className="gap-1"
                  />
                </p>
              </Card>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/residents/exemplo">
                <Button>{uiButtons('open')}</Button>
              </Link>
            </div>
          </Card>

          <Card className="space-y-2">
            <strong>{bpToday('activity.title')}</strong>
            <div className="grid gap-2">
              <Card className="space-y-1">
                <div className="text-sm">
                  <strong>{bpToday('activity.labels.when')}:</strong> 07:15
                </div>
                <div className="text-sm">
                  <strong>{bpToday('activity.labels.who')}:</strong>{' '}
                  {samples('user1')}
                </div>
                <div className="text-sm">
                  <span className="flex items-start gap-1">
                    <ResidentIdentity
                      name={samples('resident1')}
                      size="md"
                      className="gap-1"
                    />
                    <span>
                      <strong>{bpToday('activity.labels.what')}:</strong>{' '}
                      {bpToday('activity.events.e1', {
                        resident: samples('resident1')
                      })}
                    </span>
                  </span>
                </div>
              </Card>
              <Card className="space-y-1">
                <div className="text-sm">
                  <strong>{bpToday('activity.labels.when')}:</strong> 08:02
                </div>
                <div className="text-sm">
                  <strong>{bpToday('activity.labels.who')}:</strong>{' '}
                  {samples('user1')}
                </div>
                <div className="text-sm">
                  <span className="flex items-start gap-1">
                    <ResidentIdentity
                      name={samples('resident1')}
                      size="md"
                      className="gap-1"
                    />
                    <span>
                      <strong>{bpToday('activity.labels.what')}:</strong>{' '}
                      {bpToday('activity.events.e2', {
                        time: samples('time0800'),
                        resident: samples('resident1')
                      })}
                    </span>
                  </span>
                </div>
              </Card>
              <Card className="space-y-1">
                <div className="text-sm">
                  <strong>{bpToday('activity.labels.when')}:</strong> 08:10
                </div>
                <div className="text-sm">
                  <strong>{bpToday('activity.labels.who')}:</strong>{' '}
                  {samples('user1')}
                </div>
                <div className="text-sm">
                  <strong>{bpToday('activity.labels.what')}:</strong>{' '}
                  {bpToday('activity.events.e3', {
                    med: samples('med1')
                  })}
                </div>
              </Card>
              <Card className="space-y-1">
                <div className="text-sm">
                  <strong>{bpToday('activity.labels.when')}:</strong> 09:00
                </div>
                <div className="text-sm">
                  <strong>{bpToday('activity.labels.who')}:</strong>{' '}
                  {samples('user1')}
                </div>
                <div className="text-sm">
                  <strong>{bpToday('activity.labels.what')}:</strong>{' '}
                  {bpToday('activity.events.e4', {
                    shift: uiOptions('shiftDay'),
                    staff: samples('staff2')
                  })}
                </div>
              </Card>
              <Card className="space-y-1">
                <div className="text-sm">
                  <strong>{bpToday('activity.labels.when')}:</strong> 10:30
                </div>
                <div className="text-sm">
                  <strong>{bpToday('activity.labels.who')}:</strong>{' '}
                  {samples('user1')}
                </div>
                <div className="text-sm">
                  <span className="flex items-start gap-1">
                    <ResidentIdentity
                      name={samples('resident2')}
                      size="md"
                      className="gap-1"
                    />
                    <span>
                      <strong>{bpToday('activity.labels.what')}:</strong>{' '}
                      {bpToday('activity.events.e5', {
                        resident: samples('resident2')
                      })}
                    </span>
                  </span>
                </div>
              </Card>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/auditoria">
                <Button>{nav('adminAudit')}</Button>
              </Link>
            </div>
          </Card>
        </div>
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
