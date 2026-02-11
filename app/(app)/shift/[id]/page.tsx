import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { DetailsSection } from '@/components/common/details-section/details-section';
import { FormField } from '@/components/common/form-field/form-field';
import { PageHeader } from '@/components/common/page-header/page-header';
import { ResidentIdentity } from '@/components/common/resident-identity/resident-identity';
import { SegmentedControl } from '@/components/common/segmented-control/segmented-control';
import { ShiftMar } from '@/components/pages/shift-mar/shift-mar';
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

  const roleOptions: Array<{ value: ShiftRole; label: string; href: string }> =
    [
      {
        value: 'nurse',
        label: bp('mode.nurse'),
        href: `/shift/${id}?role=nurse`
      },
      {
        value: 'caregiver',
        label: bp('mode.caregiver'),
        href: `/shift/${id}?role=caregiver`
      }
    ];

  const marItems = [
    {
      id: '0800',
      time: samples('time0800'),
      medication: samples('med1'),
      dose: bpRx('sampleDose'),
      status: 'pending' as const
    },
    {
      id: '1400',
      time: samples('time1400'),
      medication: samples('med1'),
      dose: bpRx('sampleDose'),
      status: 'notGiven' as const
    },
    {
      id: '2000',
      time: samples('time2000'),
      medication: samples('med1'),
      dose: bpRx('sampleDose'),
      status: 'given' as const
    }
  ];

  const marLabels = {
    time: bp('mar.time'),
    medication: bp('mar.med'),
    dose: bp('mar.dose'),
    status: uiFields('status'),
    reason: bp('mar.reason'),
    statuses: {
      pending: bp('mar.statuses.pending'),
      given: bp('mar.statuses.given'),
      notGiven: bp('mar.statuses.notGiven')
    },
    actions: {
      given: uiButtons('given'),
      notGiven: uiButtons('notGiven'),
      save: bp('mar.actions.saveChecks')
    },
    reasonSheet: {
      title: bp('mar.reasonSheet.title'),
      description: bp('mar.reasonSheet.description'),
      reasonLabel: bp('mar.reasonSheet.reasonLabel'),
      noteLabel: bp('mar.reasonSheet.noteLabel'),
      confirm: bp('mar.reasonSheet.confirm'),
      cancel: uiButtons('cancel')
    },
    toast: {
      savedTitle: bp('mar.toast.savedTitle'),
      savedDescription: bp('mar.toast.savedDescription')
    }
  };

  const marReasonOptions = [
    {
      value: 'refusal',
      label: bp('mar.reasonSheet.options.refusal')
    },
    {
      value: 'stock',
      label: bp('mar.reasonSheet.options.stock')
    },
    {
      value: 'clinical',
      label: bp('mar.reasonSheet.options.clinical')
    },
    {
      value: 'other',
      label: bp('mar.reasonSheet.options.other')
    }
  ];

  return (
    <main>
      <PageHeader
        title={t('title')}
        subtitle={<ResidentIdentity name={residentName} size="md" />}
      />

      <section className="space-y-3">
        <Card className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ResidentIdentity name={residentName} size="lg" />
            <SegmentedControl
              ariaLabel={bp('mode.label')}
              value={role}
              options={roleOptions}
            />
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
          <div className="grid gap-2 text-sm text-ink-muted sm:grid-cols-2">
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
            <ShiftMar
              items={marItems}
              labels={marLabels}
              reasonOptions={marReasonOptions}
            />

            {isNurse ? (
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary">
                  {bp('mar.actions.editPrescription')}
                </Button>
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
            <div className="grid gap-1 text-sm text-ink-muted">
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
