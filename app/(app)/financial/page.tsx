import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { PageHeader } from '@/components/common/page-header/page-header';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';

type ReceivableStatus = 'dueSoon' | 'overdue' | 'paid';

type Receivable = {
  resident: string;
  competence: string;
  dueDate: string;
  amount: number;
  status: ReceivableStatus;
};

type PayrollItem = {
  professional: string;
  period: string;
  shifts: number;
  amount: number;
  status: 'statusConfirmed' | 'statusPaid';
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export default async function FinancialPage() {
  const t = await getTranslations('pages.financial');
  const s = await getTranslations('pages.financial.sections');
  const nav = await getTranslations('nav');
  const uiOptions = await getTranslations('ui.options');
  const samples = await getTranslations('ui.samples');
  const bp = await getTranslations('blueprints.financial');

  const receivables: Receivable[] = [
    {
      resident: samples('resident1'),
      competence: '02/2026',
      dueDate: '10/02',
      amount: 1500,
      status: 'dueSoon'
    },
    {
      resident: samples('resident3'),
      competence: '02/2026',
      dueDate: '05/02',
      amount: 1500,
      status: 'overdue'
    },
    {
      resident: samples('resident5'),
      competence: '02/2026',
      dueDate: '03/02',
      amount: 1500,
      status: 'paid'
    }
  ];

  const payroll: PayrollItem[] = [
    {
      professional: samples('staff3'),
      period: '01/02-15/02',
      shifts: 12,
      amount: 2400,
      status: 'statusConfirmed'
    },
    {
      professional: samples('staff4'),
      period: '01/02-15/02',
      shifts: 10,
      amount: 2500,
      status: 'statusPaid'
    }
  ];

  const totalReceivables = receivables.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalReceived = receivables
    .filter((item) => item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);
  const openBalance = totalReceivables - totalReceived;
  const totalPayroll = payroll.reduce((sum, item) => sum + item.amount, 0);

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <section>
        <h2>{s('overview')}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="space-y-1">
            <strong>{bp('overview.cards.projectedRevenue.title')}</strong>
            <p>
              {bp('overview.cards.projectedRevenue.helper', {
                month: '02/2026'
              })}
            </p>
            <p className="text-xl font-semibold text-ink-strong">
              {currencyFormatter.format(totalReceivables)}
            </p>
          </Card>
          <Card className="space-y-1">
            <strong>{bp('overview.cards.receivedRevenue.title')}</strong>
            <p>{bp('overview.cards.receivedRevenue.helper')}</p>
            <p className="text-xl font-semibold text-ink-strong">
              {currencyFormatter.format(totalReceived)}
            </p>
          </Card>
          <Card className="space-y-1">
            <strong>{bp('overview.cards.openBalance.title')}</strong>
            <p>{bp('overview.cards.openBalance.helper')}</p>
            <p className="text-xl font-semibold text-ink-strong">
              {currencyFormatter.format(openBalance)}
            </p>
          </Card>
        </div>
      </section>

      <section>
        <h2>{s('receivables')}</h2>
        <div className="grid gap-3">
          {receivables.map((item) => (
            <Card
              key={`${item.resident}-${item.dueDate}`}
              className="space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <strong>{item.resident}</strong>
                <Badge
                  variant={
                    item.status === 'paid'
                      ? 'success'
                      : item.status === 'overdue'
                        ? 'danger'
                        : 'warning'
                  }
                >
                  {bp(`receivables.statuses.${item.status}`)}
                </Badge>
              </div>

              <div className="grid gap-1 text-sm text-slate-800 sm:grid-cols-2">
                <div>
                  <strong>{bp('receivables.labels.competence')}:</strong>{' '}
                  {item.competence}
                </div>
                <div>
                  <strong>{bp('receivables.labels.due')}:</strong>{' '}
                  {item.dueDate}
                </div>
                <div>
                  <strong>{bp('receivables.labels.amount')}:</strong>{' '}
                  {currencyFormatter.format(item.amount)}
                </div>
                <div>
                  <strong>{bp('receivables.labels.status')}:</strong>{' '}
                  {bp(`receivables.statuses.${item.status}`)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2>{s('payroll')}</h2>
        <div className="grid gap-3">
          {payroll.map((item) => (
            <Card key={item.professional} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <strong>{item.professional}</strong>
                <Badge
                  variant={item.status === 'statusPaid' ? 'success' : 'warning'}
                >
                  {uiOptions(item.status)}
                </Badge>
              </div>

              <div className="grid gap-1 text-sm text-slate-800 sm:grid-cols-2">
                <div>
                  <strong>{bp('payroll.labels.period')}:</strong> {item.period}
                </div>
                <div>
                  <strong>{bp('payroll.labels.shifts')}:</strong> {item.shifts}
                </div>
                <div>
                  <strong>{bp('payroll.labels.amount')}:</strong>{' '}
                  {currencyFormatter.format(item.amount)}
                </div>
                <div>
                  <strong>{bp('payroll.labels.status')}:</strong>{' '}
                  {uiOptions(item.status)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2>{s('actions')}</h2>
        <Card className="space-y-3">
          <div className="grid gap-1 text-sm text-slate-800 sm:grid-cols-3">
            <div>
              <strong>{bp('totals.expected')}:</strong>{' '}
              {currencyFormatter.format(totalReceivables)}
            </div>
            <div>
              <strong>{bp('totals.received')}:</strong>{' '}
              {currencyFormatter.format(totalReceived)}
            </div>
            <div>
              <strong>{bp('totals.payroll')}:</strong>{' '}
              {currencyFormatter.format(totalPayroll)}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button">{bp('actions.exportReport')}</Button>
            <Button type="button">{bp('actions.closeCompetence')}</Button>
            <Link href="/residents">
              <Button type="button">{nav('residents')}</Button>
            </Link>
            <Link href="/schedule">
              <Button type="button">{nav('schedule')}</Button>
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
