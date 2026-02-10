import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { PageHeader } from '@/components/common/page-header/page-header';
import { FormField } from '@/components/common/form-field/form-field';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';

export default async function ResidentsPage() {
  const t = await getTranslations('pages.residents');
  const s = await getTranslations('pages.residents.sections');
  const nav = await getTranslations('nav');
  const uiButtons = await getTranslations('ui.buttons');
  const uiFields = await getTranslations('ui.fields');
  const samples = await getTranslations('ui.samples');
  const bpFilters = await getTranslations('blueprints.residents.filters');
  const bpCard = await getTranslations('blueprints.residents.list.card');

  const sampleResidentId = 'exemplo';

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <section>
        <h2>{s('filters')}</h2>
        <Card className="space-y-3">
          <FormField id="resident-search" label={uiFields('search')}>
            <Input
              id="resident-search"
              placeholder={uiFields('search')}
              defaultValue=""
            />
          </FormField>

          <div className="flex flex-wrap gap-2">
            <Button type="button">{bpFilters('active')}</Button>
            <Button type="button">{bpFilters('inactive')}</Button>
            <Button type="button">{bpFilters('discharged')}</Button>
            <Button type="button">{bpFilters('deceased')}</Button>
          </div>
        </Card>
      </section>
      <section>
        <h2>{s('list')}</h2>
        <div className="grid gap-3">
          {[
            samples('resident1'),
            samples('resident2'),
            samples('resident3')
          ].map((name, idx) => (
            <Card key={name} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <strong>{name}</strong>
                <Badge variant={idx === 0 ? 'success' : 'muted'}>
                  {bpFilters(idx === 0 ? 'active' : 'inactive')}
                </Badge>
              </div>
              <div className="grid gap-1 text-sm text-slate-800">
                <div>
                  <strong>{bpCard('room')}:</strong> {samples('room101')}
                </div>
                <div>
                  <strong>{bpCard('bed')}:</strong> {samples('bedA')}
                </div>
                <div>
                  <strong>{bpCard('dependency')}:</strong>{' '}
                  {samples('dependency2')}
                </div>
                <div>
                  <strong>{bpCard('diet')}:</strong> {samples('dietSoft')}
                </div>
                <div>
                  <strong>{bpCard('mobility')}:</strong>{' '}
                  {samples('mobilityWalker')}
                </div>
              </div>
              <div>
                <Link
                  className="underline"
                  href={`/residents/${sampleResidentId}`}
                >
                  {uiButtons('open')}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <section>
        <h2>{s('actions')}</h2>
        <div className="flex flex-wrap gap-2">
          <Button type="button">{uiButtons('new')}</Button>
          <Link className="underline" href={`/residents/${sampleResidentId}`}>
            {t('sampleResident')}
          </Link>
        </div>
      </section>
    </main>
  );
}
