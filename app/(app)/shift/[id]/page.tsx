import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { DetailsSection } from '@/components/common/details-section/details-section';
import { FormField } from '@/components/common/form-field/form-field';
import { PageHeader } from '@/components/common/page-header/page-header';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Select } from '@/components/ui/select/select';
import { Textarea } from '@/components/ui/textarea/textarea';

type ShiftRole = 'nurse' | 'caregiver';

function toShiftRole(value: unknown): ShiftRole {
  return value === 'caregiver' ? 'caregiver' : 'nurse';
}

export default async function ShiftResidentPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const role = toShiftRole(Array.isArray(sp.role) ? sp.role[0] : sp.role);
  const isNurse = role === 'nurse';

  const t = await getTranslations('pages.shift');
  const s = await getTranslations('pages.shift.sections');
  const nav = await getTranslations('nav');
  const uiButtons = await getTranslations('ui.buttons');
  const uiFields = await getTranslations('ui.fields');
  const uiOptions = await getTranslations('ui.options');
  const samples = await getTranslations('ui.samples');

  const bp = await getTranslations('blueprints.shift');
  const bpRx = await getTranslations(
    'blueprints.residentDetails.prescriptions'
  );

  const residentName =
    id === 'exemplo'
      ? samples('resident1')
      : id === 'exemplo-2'
        ? samples('resident2')
        : id === 'exemplo-3'
          ? samples('resident3')
          : id;

  return (
    <main>
      <PageHeader title={t('title')} subtitle={residentName} />

      <section className="space-y-3">
        <Card className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <strong>{residentName}</strong>
            <Badge variant="muted">
              {role === 'nurse'
                ? uiOptions('roleNurse')
                : uiOptions('roleCaregiver')}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/shift?role=${role}`}>
              <Button type="button">{uiButtons('back')}</Button>
            </Link>
            <Link href={`/residents/${id}`}>
              <Button type="button">{nav('residents')}</Button>
            </Link>
          </div>
        </Card>

        <DetailsSection title={s('residentSummary')} defaultOpen>
          <div className="grid gap-2 text-sm text-slate-800 sm:grid-cols-2">
            <div>
              <strong>{bp('summary.roomBed')}:</strong> {samples('room101')} /{' '}
              {samples('bedA')}
            </div>
            <div>
              <strong>{bp('summary.dependency')}:</strong>{' '}
              {samples('dependency2')}
            </div>
            <div>
              <strong>{bp('summary.diet')}:</strong> {samples('dietSoft')}
            </div>
            <div>
              <strong>{bp('summary.mobility')}:</strong>{' '}
              {samples('mobilityWalker')}
            </div>
          </div>
          <div className="mt-3">
            <strong>{bp('summary.alerts')}:</strong>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="warning">{bp('summary.badges.lowStock')}</Badge>
              <Badge variant="danger">{bp('summary.badges.lateCheck')}</Badge>
            </div>
          </div>
        </DetailsSection>

        <DetailsSection title={s('mar')} defaultOpen>
          <div className="grid gap-3">
            {[
              samples('time0800'),
              samples('time1400'),
              samples('time2000')
            ].map((time, idx) => (
              <Card key={time} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <strong>
                    {bp('mar.time')}: {time}
                  </strong>
                  <Badge
                    variant={
                      idx === 0 ? 'danger' : idx === 1 ? 'muted' : 'success'
                    }
                  >
                    {idx === 0
                      ? bp('mar.statuses.pending')
                      : idx === 1
                        ? bp('mar.statuses.notGiven')
                        : bp('mar.statuses.given')}
                  </Badge>
                </div>
                <div className="grid gap-2 text-sm text-slate-800 sm:grid-cols-3">
                  <div>
                    <strong>{bp('mar.med')}:</strong> {samples('med1')}
                  </div>
                  <div>
                    <strong>{bp('mar.dose')}:</strong> {bpRx('sampleDose')}
                  </div>
                  <div>
                    <strong>{uiFields('status')}:</strong>{' '}
                    {idx === 0
                      ? bp('mar.statuses.pending')
                      : idx === 1
                        ? bp('mar.statuses.notGiven')
                        : bp('mar.statuses.given')}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button">{uiButtons('given')}</Button>
                  <Button type="button">{uiButtons('notGiven')}</Button>
                  {isNurse ? (
                    <Button type="button">
                      {bp('mar.actions.editPrescription')}
                    </Button>
                  ) : null}
                </div>
              </Card>
            ))}

            {isNurse ? (
              <div className="flex flex-wrap gap-2">
                <Button type="button">
                  {bp('mar.actions.addPrescription')}
                </Button>
              </div>
            ) : null}
          </div>
        </DetailsSection>

        <DetailsSection title={s('shiftReport')} defaultOpen={false}>
          <Card className="space-y-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="report-date" label={bp('report.date')}>
                <Input id="report-date" type="date" />
              </FormField>
              <FormField id="report-shift" label={bp('report.shift')}>
                <Select id="report-shift" defaultValue="day">
                  <option value="day">{uiOptions('shiftDay')}</option>
                  <option value="night">{uiOptions('shiftNight')}</option>
                </Select>
              </FormField>
            </div>
            <FormField
              id="report-body"
              label={bp('report.body')}
              hint={
                isNurse
                  ? bp('report.helper.nurse')
                  : bp('report.helper.caregiver')
              }
            >
              <Textarea id="report-body" defaultValue="" readOnly={!isNurse} />
            </FormField>
            <div className="flex flex-wrap gap-2">
              {isNurse ? (
                <Button type="button">{bp('report.actions.save')}</Button>
              ) : (
                <Button type="button">{uiButtons('open')}</Button>
              )}
            </div>
          </Card>
        </DetailsSection>

        <DetailsSection title={s('prescriptions')} defaultOpen={false}>
          <Card className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <strong>{samples('med1')}</strong>
              <Badge variant="muted">{samples('rxTimes')}</Badge>
            </div>
            <div className="grid gap-1 text-sm text-slate-800">
              <div>
                <strong>{bpRx('dose')}:</strong> {bpRx('sampleDose')}
              </div>
              <div>
                <strong>{bpRx('route')}:</strong> {bpRx('sampleRoute')}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {isNurse ? (
                <Button type="button">
                  {bp('mar.actions.editPrescription')}
                </Button>
              ) : null}
            </div>
          </Card>
        </DetailsSection>
      </section>
    </main>
  );
}
