import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common/page-header/page-header';
import { FormField } from '@/components/common/form-field/form-field';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Select } from '@/components/ui/select/select';

export default async function SchedulePage() {
  const t = await getTranslations('pages.schedule');
  const s = await getTranslations('pages.schedule.sections');
  const uiButtons = await getTranslations('ui.buttons');
  const uiOptions = await getTranslations('ui.options');
  const samples = await getTranslations('ui.samples');
  const bp = await getTranslations('blueprints.schedule');

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <section>
        <h2>{s('calendar')}</h2>
        <Card className="grid gap-4 sm:grid-cols-2">
          <FormField id="schedule-date" label={bp('filters.date')}>
            <Input id="schedule-date" type="date" />
          </FormField>
          <FormField id="schedule-shift" label={bp('filters.shift')}>
            <Select id="schedule-shift" defaultValue="day">
              <option value="day">{uiOptions('shiftDay')}</option>
              <option value="night">{uiOptions('shiftNight')}</option>
            </Select>
          </FormField>
        </Card>
      </section>
      <section>
        <h2>{s('dayNight')}</h2>
        <div className="flex flex-wrap gap-2">
          <Button type="button">{uiOptions('shiftDay')}</Button>
          <Button type="button">{uiOptions('shiftNight')}</Button>
        </div>
      </section>
      <section>
        <h2>{s('assignments')}</h2>
        <div className="grid gap-3">
          {[samples('staff1'), samples('staff2')].map((staff, idx) => (
            <Card key={staff} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <strong>{bp('assignment.title')}</strong>
                <Badge variant={idx === 0 ? 'muted' : 'success'}>
                  {idx === 0
                    ? uiOptions('statusPending')
                    : uiOptions('statusConfirmed')}
                </Badge>
              </div>
              <div className="grid gap-1 text-sm text-slate-800">
                <div>
                  <strong>{bp('assignment.staff')}:</strong> {staff}
                </div>
                <div>
                  <strong>{bp('assignment.amount')}:</strong>{' '}
                  {idx === 0 ? samples('amountDay') : samples('amountNight')}
                </div>
                <div>
                  <strong>{bp('assignment.status')}:</strong>{' '}
                  {idx === 0
                    ? uiOptions('statusPending')
                    : uiOptions('statusConfirmed')}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button">{uiButtons('save')}</Button>
                <Button type="button">{uiButtons('cancel')}</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <section>
        <h2>{s('closeMonth')}</h2>
        <Card className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="close-month" label={bp('close.labels.month')}>
              <Select id="close-month" defaultValue="2026-02">
                <option value="2026-02">02/2026</option>
                <option value="2026-01">01/2026</option>
              </Select>
            </FormField>
            <div className="flex items-end gap-2">
              <Button type="button">{bp('close.actions.generate')}</Button>
              <Button type="button">{bp('close.actions.close')}</Button>
            </div>
          </div>

          <div className="grid gap-3">
            {[samples('staff1'), samples('staff2')].map((staff, idx) => (
              <Card key={staff} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <strong>
                    {bp('close.labels.staff')}: {staff}
                  </strong>
                  <Badge variant={idx === 0 ? 'warning' : 'success'}>
                    {idx === 0
                      ? uiOptions('statusConfirmed')
                      : uiOptions('statusPaid')}
                  </Badge>
                </div>
                <div className="grid gap-1 text-sm text-slate-800 sm:grid-cols-3">
                  <div>
                    <strong>{bp('close.labels.totalShifts')}:</strong>{' '}
                    {idx === 0 ? 12 : 10}
                  </div>
                  <div>
                    <strong>{bp('close.labels.totalAmount')}:</strong>{' '}
                    {idx === 0 ? 2400 : 2500}
                  </div>
                  <div>
                    <strong>{bp('close.labels.status')}:</strong>{' '}
                    {idx === 0
                      ? uiOptions('statusConfirmed')
                      : uiOptions('statusPaid')}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button">{bp('close.actions.markPaid')}</Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
