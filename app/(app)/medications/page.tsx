import { getTranslations } from 'next-intl/server';

import { DetailsSection } from '@/components/common/details-section/details-section';
import { FormField } from '@/components/common/form-field/form-field';
import { PageHeader } from '@/components/common/page-header/page-header';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Select } from '@/components/ui/select/select';
import { Textarea } from '@/components/ui/textarea/textarea';

export default async function StockPage() {
  const t = await getTranslations('pages.medications');
  const s = await getTranslations('pages.medications.sections');
  const uiButtons = await getTranslations('ui.buttons');
  const samples = await getTranslations('ui.samples');
  const bp = await getTranslations('blueprints.medications');

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

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
              <div className="grid gap-1 text-sm text-ink-muted">
                <div>
                  <strong>{bp('catalog.min')}:</strong> {samples('qty6')}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button">{uiButtons('register')}</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <DetailsSection title={bp('stock.summary.title')} defaultOpen={false}>
          <Card className="space-y-2">
            <div className="grid gap-1 text-sm text-ink-muted sm:grid-cols-2">
              <div>
                <strong>{bp('stock.summary.items')}:</strong> 24
              </div>
              <div>
                <strong>{bp('stock.summary.lowStock')}:</strong> 2
              </div>
            </div>
          </Card>
        </DetailsSection>

        <DetailsSection title={s('stock')} defaultOpen={false}>
          <Card className="space-y-3">
            <strong>{bp('stock.title')}</strong>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="stock-med" label={bp('stock.labels.medication')}>
                <Select id="stock-med" defaultValue={samples('med1')}>
                  <option value={samples('med1')}>{samples('med1')}</option>
                  <option value={samples('med2')}>{samples('med2')}</option>
                </Select>
              </FormField>
              <FormField
                id="stock-type"
                label={bp('stock.labels.movementType')}
              >
                <Select id="stock-type" defaultValue="out">
                  <option value="in">{bp('stock.options.in')}</option>
                  <option value="out">{bp('stock.options.out')}</option>
                  <option value="adjustment">
                    {bp('stock.options.adjustment')}
                  </option>
                </Select>
              </FormField>
              <FormField id="stock-qty" label={bp('stock.labels.quantity')}>
                <Input id="stock-qty" defaultValue="1" inputMode="numeric" />
              </FormField>
              <FormField id="stock-lot" label={bp('stock.labels.lot')}>
                <Input id="stock-lot" defaultValue="" />
              </FormField>
              <FormField id="stock-exp" label={bp('stock.labels.expiresOn')}>
                <Input id="stock-exp" type="date" />
              </FormField>
              <FormField
                id="stock-reason"
                label={bp('stock.labels.reason')}
                className="sm:col-span-2"
              >
                <Textarea id="stock-reason" defaultValue="" />
              </FormField>
              <div className="sm:col-span-2 flex flex-wrap gap-2">
                <Button type="button">{uiButtons('register')}</Button>
                <Button type="button">{uiButtons('cancel')}</Button>
              </div>
            </div>
          </Card>
        </DetailsSection>

        <DetailsSection title={bp('form.title')} defaultOpen={false}>
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
        </DetailsSection>

        <DetailsSection title={s('movements')} defaultOpen={false}>
          <div className="grid gap-3">
            <Card className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <strong>{bp('movements.title')}</strong>
                <Badge variant="muted">{bp('movements.type')}</Badge>
              </div>
              <div className="grid gap-1 text-sm text-ink-muted">
                <div>
                  <strong>{bp('movements.qty')}:</strong>{' '}
                  {samples('movementIn')}
                </div>
                <div>
                  <strong>{bp('movements.when')}:</strong>{' '}
                  {samples('billingDue')}
                </div>
              </div>
            </Card>
            <Card className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <strong>{bp('movements.title')}</strong>
                <Badge variant="muted">{bp('movements.type')}</Badge>
              </div>
              <div className="grid gap-1 text-sm text-ink-muted">
                <div>
                  <strong>{bp('movements.qty')}:</strong>{' '}
                  {samples('movementOut')}
                </div>
                <div>
                  <strong>{bp('movements.when')}:</strong>{' '}
                  {samples('billingDue')}
                </div>
              </div>
            </Card>
          </div>
        </DetailsSection>
      </section>
    </main>
  );
}
