import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { DetailsSection } from '@/components/common/details-section/details-section';
import { PageHeader } from '@/components/common/page-header/page-header';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';

type ShiftRole = 'nurse' | 'caregiver';

function toShiftRole(value: unknown): ShiftRole {
  return value === 'caregiver' ? 'caregiver' : 'nurse';
}

export default async function ShiftPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const role = toShiftRole(Array.isArray(sp.role) ? sp.role[0] : sp.role);

  const t = await getTranslations('pages.shift');
  const s = await getTranslations('pages.shift.sections');
  const uiButtons = await getTranslations('ui.buttons');
  const uiFields = await getTranslations('ui.fields');
  const uiOptions = await getTranslations('ui.options');
  const samples = await getTranslations('ui.samples');
  const bp = await getTranslations('blueprints.shift');

  const residents = [
    { id: 'exemplo', name: samples('resident1') },
    { id: 'exemplo-2', name: samples('resident2') },
    { id: 'exemplo-3', name: samples('resident3') }
  ];

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <section className="space-y-3">
        <DetailsSection title={s('mode')} defaultOpen>
          <div className="space-y-3">
            <div className="text-sm text-slate-800">
              <strong>{bp('mode.label')}:</strong>{' '}
              {role === 'nurse'
                ? uiOptions('roleNurse')
                : uiOptions('roleCaregiver')}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/shift?role=nurse">
                <Button type="button">{bp('mode.nurse')}</Button>
              </Link>
              <Link href="/shift?role=caregiver">
                <Button type="button">{bp('mode.caregiver')}</Button>
              </Link>
            </div>
          </div>
        </DetailsSection>

        <Card className="space-y-3">
          <strong>{s('residentSelect')}</strong>
          <Input placeholder={uiFields('search')} />

          <div className="grid gap-3 sm:grid-cols-2">
            {residents.map((resident, idx) => (
              <Link
                key={resident.id}
                className="block"
                href={`/shift/${resident.id}?role=${role}`}
              >
                <Card className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <strong>{resident.name}</strong>
                    <Badge variant={idx === 0 ? 'danger' : 'muted'}>
                      {idx === 0
                        ? bp('summary.badges.lateCheck')
                        : bp('residentList.selected')}
                    </Badge>
                  </div>
                  <div className="grid gap-1 text-sm text-slate-800">
                    <div>
                      <strong>{bp('summary.roomBed')}:</strong>{' '}
                      {samples('room101')} / {samples('bedA')}
                    </div>
                    <div>
                      <strong>{bp('summary.dependency')}:</strong>{' '}
                      {samples('dependency2')}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
