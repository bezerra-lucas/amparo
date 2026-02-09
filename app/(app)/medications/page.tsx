import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common/page-header/page-header';
import { FormField } from '@/components/common/form-field/form-field';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Textarea } from '@/components/ui/textarea/textarea';

export default async function MedicationsPage() {
  const t = await getTranslations('pages.medications');
  const s = await getTranslations('pages.medications.sections');
  const uiButtons = await getTranslations('ui.buttons');
  const samples = await getTranslations('ui.samples');
  const bp = await getTranslations('blueprints.medications');

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <section>
        <h2>{bp('form.title')}</h2>
        <Card className="grid gap-4 sm:grid-cols-2">
          <FormField id="med-name" label={bp('form.name')}>
            <Input id="med-name" defaultValue="" />
          </FormField>
          <FormField id="med-form" label={bp('form.form')}>
            <Input id="med-form" defaultValue="" />
          </FormField>
          <FormField
            id="med-notes"
            label={bp('form.notes')}
            className="sm:col-span-2"
          >
            <Textarea id="med-notes" defaultValue="" />
          </FormField>
          <div className="sm:col-span-2">
            <Button type="button">{uiButtons('save')}</Button>
          </div>
        </Card>
      </section>
      <section>
        <h2>{s('catalog')}</h2>
        <div className="grid gap-3">
          {[samples('med1'), samples('med2')].map((med, idx) => (
            <Card key={med} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <strong>{med}</strong>
                <Badge variant={idx === 0 ? 'warning' : 'success'}>
                  {bp('catalog.stock')}:{' '}
                  {idx === 0 ? samples('qty6') : samples('qty12')}
                </Badge>
              </div>
              <div className="grid gap-1 text-sm text-slate-800">
                <div>
                  <strong>{bp('catalog.min')}:</strong> {samples('qty6')}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button">{uiButtons('register')}</Button>
                <Button type="button">{uiButtons('new')}</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <section>
        <h2>{s('stock')}</h2>
        <Card className="space-y-2">
          <p>{bp('catalog.title')}</p>
        </Card>
      </section>
      <section>
        <h2>{s('movements')}</h2>
        <div className="grid gap-3">
          <Card className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <strong>{bp('movements.title')}</strong>
              <Badge variant="muted">{bp('movements.type')}</Badge>
            </div>
            <div className="grid gap-1 text-sm text-slate-800">
              <div>
                <strong>{bp('movements.qty')}:</strong> {samples('movementIn')}
              </div>
              <div>
                <strong>{bp('movements.when')}:</strong> {samples('billingDue')}
              </div>
            </div>
          </Card>
          <Card className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <strong>{bp('movements.title')}</strong>
              <Badge variant="muted">{bp('movements.type')}</Badge>
            </div>
            <div className="grid gap-1 text-sm text-slate-800">
              <div>
                <strong>{bp('movements.qty')}:</strong> {samples('movementOut')}
              </div>
              <div>
                <strong>{bp('movements.when')}:</strong> {samples('billingDue')}
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
