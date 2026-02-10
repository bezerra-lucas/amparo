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

export default async function ResidentDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const t = await getTranslations('pages.residentDetails');
  const tabs = await getTranslations('pages.residentDetails.tabs');
  const nav = await getTranslations('nav');
  const uiButtons = await getTranslations('ui.buttons');
  const uiFields = await getTranslations('ui.fields');
  const uiOptions = await getTranslations('ui.options');
  const samples = await getTranslations('ui.samples');

  const bpSummary = await getTranslations('blueprints.residentDetails.summary');
  const bpSupplies = await getTranslations(
    'blueprints.residentDetails.supplies'
  );
  const bpRx = await getTranslations(
    'blueprints.residentDetails.prescriptions'
  );
  const bpMar = await getTranslations('blueprints.residentDetails.mar');
  const bpBilling = await getTranslations('blueprints.residentDetails.billing');

  const residentName = id === 'exemplo' ? samples('resident1') : id;

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <section>
        <div className="flex flex-wrap gap-2">
          <Link href="/residents">
            <Button type="button">{t('backToResidents')}</Button>
          </Link>
          <Link href="/shift?role=nurse">
            <Button type="button">{nav('shift')}</Button>
          </Link>
        </div>
      </section>

      <section>
        <h2>{bpSummary('title')}</h2>
        <Card className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <strong>{residentName}</strong>
            <Badge variant="success">{bpSummary('active')}</Badge>
          </div>
          <div className="grid gap-1 text-sm text-slate-800">
            <div>
              <strong>{bpSummary('id')}:</strong> {id}
            </div>
            <div>
              <strong>{bpSummary('roomBed')}:</strong> {samples('room101')} /{' '}
              {samples('bedA')}
            </div>
            <div>
              <strong>{bpSummary('status')}:</strong> {bpSummary('active')}
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <DetailsSection title={tabs('mar')} defaultOpen>
          <div className="grid gap-2">
            {[
              samples('time0800'),
              samples('time1400'),
              samples('time2000')
            ].map((time, idx) => (
              <Card key={time} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <strong>
                    {bpMar('time')}: {time}
                  </strong>
                  <Badge
                    variant={
                      idx === 0 ? 'danger' : idx === 1 ? 'muted' : 'success'
                    }
                  >
                    {idx === 0
                      ? bpMar('pending')
                      : idx === 1
                        ? bpMar('notGiven')
                        : bpMar('done')}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button">{uiButtons('given')}</Button>
                  <Button type="button">{uiButtons('notGiven')}</Button>
                </div>
              </Card>
            ))}
          </div>
        </DetailsSection>

        <DetailsSection title={tabs('admission')} defaultOpen>
          <Card className="grid gap-4 sm:grid-cols-2">
            <FormField id="resident-name" label={uiFields('residentName')}>
              <Input id="resident-name" defaultValue={residentName} />
            </FormField>

            <FormField id="resident-admitted" label={uiFields('admissionDate')}>
              <Input id="resident-admitted" type="date" />
            </FormField>

            <FormField
              id="resident-dependency"
              label={uiFields('dependencyLevel')}
            >
              <Select
                id="resident-dependency"
                defaultValue={uiOptions('dependency2')}
              >
                <option value={uiOptions('dependency1')}>
                  {uiOptions('dependency1')}
                </option>
                <option value={uiOptions('dependency2')}>
                  {uiOptions('dependency2')}
                </option>
                <option value={uiOptions('dependency3')}>
                  {uiOptions('dependency3')}
                </option>
              </Select>
            </FormField>

            <FormField id="resident-mobility" label={uiFields('mobility')}>
              <Input
                id="resident-mobility"
                defaultValue={samples('mobilityWalker')}
              />
            </FormField>

            <FormField
              id="resident-diet"
              label={uiFields('dietRestrictions')}
              className="sm:col-span-2"
            >
              <Input id="resident-diet" defaultValue={samples('dietSoft')} />
            </FormField>

            <FormField
              id="resident-notes"
              label={uiFields('notes')}
              className="sm:col-span-2"
            >
              <Textarea id="resident-notes" defaultValue="" />
            </FormField>

            <div className="sm:col-span-2">
              <Button type="button">{uiButtons('save')}</Button>
            </div>
          </Card>
        </DetailsSection>

        <DetailsSection title={tabs('nursing')} defaultOpen={false}>
          <Card className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="nursing-date" label={uiFields('date')}>
                <Input id="nursing-date" type="date" />
              </FormField>
              <FormField id="nursing-shift" label={uiFields('shift')}>
                <Select id="nursing-shift" defaultValue="day">
                  <option value="day">{uiOptions('shiftDay')}</option>
                  <option value="night">{uiOptions('shiftNight')}</option>
                </Select>
              </FormField>
            </div>
            <FormField id="nursing-body" label={uiFields('notes')}>
              <Textarea id="nursing-body" defaultValue="" />
            </FormField>
            <div>
              <Button type="button">{uiButtons('save')}</Button>
            </div>
          </Card>
        </DetailsSection>

        <DetailsSection title={tabs('prescriptions')} defaultOpen={false}>
          <div className="grid gap-3">
            {[samples('med1'), samples('med2')].map((med) => (
              <Card key={med} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <strong>{med}</strong>
                  <Badge variant="muted">{tabs('prescriptions')}</Badge>
                </div>
                <div className="grid gap-1 text-sm text-slate-800">
                  <div>
                    <strong>{bpRx('dose')}:</strong> {bpRx('sampleDose')}
                  </div>
                  <div>
                    <strong>{bpRx('route')}:</strong> {bpRx('sampleRoute')}
                  </div>
                  <div>
                    <strong>{bpRx('times')}:</strong> {samples('rxTimes')}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button">{uiButtons('new')}</Button>
                  <Button type="button">{uiButtons('save')}</Button>
                </div>
              </Card>
            ))}
          </div>
        </DetailsSection>

        <DetailsSection title={tabs('supplies')} defaultOpen={false}>
          <div className="grid gap-3">
            {[bpSupplies('sampleItem1'), bpSupplies('sampleItem2')].map(
              (item) => (
                <Card key={item} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <strong>{item}</strong>
                    <Badge variant="muted">{uiFields('status')}</Badge>
                  </div>
                  <div className="grid gap-1 text-sm text-slate-800">
                    <div>
                      <strong>{bpSupplies('balance')}:</strong>{' '}
                      {samples('qty12')}
                    </div>
                    <div>
                      <strong>{bpSupplies('min')}:</strong> {samples('qty6')}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button">{uiButtons('register')}</Button>
                    <Button type="button">{uiButtons('new')}</Button>
                  </div>
                </Card>
              )
            )}
          </div>
        </DetailsSection>

        <DetailsSection title={tabs('billing')} defaultOpen={false}>
          <div className="grid gap-3">
            {[bpBilling('open'), bpBilling('paid'), bpBilling('late')].map(
              (st) => (
                <Card key={st} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <strong>{bpBilling('competence')}:</strong>
                    <Badge
                      variant={
                        st === bpBilling('paid')
                          ? 'success'
                          : st === bpBilling('late')
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {st}
                    </Badge>
                  </div>
                  <div className="grid gap-1 text-sm text-slate-800">
                    <div>
                      <strong>{bpBilling('due')}:</strong>{' '}
                      {samples('billingDue')}
                    </div>
                    <div>
                      <strong>{bpBilling('amount')}:</strong>{' '}
                      {samples('billingAmount')}
                    </div>
                    <div>
                      <strong>{bpBilling('status')}:</strong> {st}
                    </div>
                  </div>
                </Card>
              )
            )}
          </div>
        </DetailsSection>
      </section>
    </main>
  );
}
