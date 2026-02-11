import { getTranslations } from 'next-intl/server';

import { DetailsSection } from '@/components/common/details-section/details-section';
import { PageHeader } from '@/components/common/page-header/page-header';
import { FormField } from '@/components/common/form-field/form-field';
import { ScheduleWeekView } from '@/components/pages/schedule-week-view/schedule-week-view';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Select } from '@/components/ui/select/select';

export default async function SchedulePage() {
  const t = await getTranslations('pages.schedule');
  const s = await getTranslations('pages.schedule.sections');
  const uiOptions = await getTranslations('ui.options');
  const samples = await getTranslations('ui.samples');
  const bp = await getTranslations('blueprints.schedule');
  const week = await getTranslations('pages.schedule.weekView');

  const days = [
    { key: 'mon', label: week('days.mon'), dateLabel: week('dates.mon') },
    { key: 'tue', label: week('days.tue'), dateLabel: week('dates.tue') },
    { key: 'wed', label: week('days.wed'), dateLabel: week('dates.wed') },
    { key: 'thu', label: week('days.thu'), dateLabel: week('dates.thu') },
    { key: 'fri', label: week('days.fri'), dateLabel: week('dates.fri') },
    { key: 'sat', label: week('days.sat'), dateLabel: week('dates.sat') },
    { key: 'sun', label: week('days.sun'), dateLabel: week('dates.sun') }
  ];

  const legend = [
    { type: 'nurse' as const, label: uiOptions('roleNurse') },
    { type: 'caregiver' as const, label: uiOptions('roleCaregiver') },
    { type: 'doctor' as const, label: uiOptions('roleDoctor') },
    {
      type: 'physiotherapist' as const,
      label: uiOptions('rolePhysiotherapist')
    }
  ];

  const shifts = [
    {
      id: 'shift-01',
      dayKey: 'mon',
      start: '07:00',
      end: '11:00',
      title: week('events.medicationRound'),
      professional: samples('staff3'),
      resident: samples('resident1'),
      unit: week('units.wingNorth'),
      professionalType: 'nurse' as const
    },
    {
      id: 'shift-02',
      dayKey: 'mon',
      start: '13:00',
      end: '17:00',
      title: week('events.dailyCareSupport'),
      professional: samples('staff4'),
      resident: samples('resident2'),
      unit: week('units.wingSouth'),
      professionalType: 'caregiver' as const
    },
    {
      id: 'shift-03',
      dayKey: 'tue',
      start: '08:00',
      end: '12:00',
      title: week('events.clinicalAssessment'),
      professional: samples('staff5'),
      resident: samples('resident4'),
      unit: week('units.clinic'),
      professionalType: 'doctor' as const
    },
    {
      id: 'shift-04',
      dayKey: 'tue',
      start: '14:00',
      end: '18:00',
      title: week('events.motorRehabSession'),
      professional: samples('staff6'),
      resident: samples('resident3'),
      unit: week('units.gym'),
      professionalType: 'physiotherapist' as const
    },
    {
      id: 'shift-05',
      dayKey: 'wed',
      start: '07:00',
      end: '13:00',
      title: week('events.procedureFollowUp'),
      professional: samples('staff7'),
      resident: samples('resident5'),
      unit: week('units.wingNorth'),
      professionalType: 'nurse' as const
    },
    {
      id: 'shift-06',
      dayKey: 'wed',
      start: '18:00',
      end: '22:00',
      title: week('events.nightHandover'),
      professional: samples('staff8'),
      resident: samples('resident1'),
      unit: week('units.wingSouth'),
      professionalType: 'caregiver' as const
    },
    {
      id: 'shift-07',
      dayKey: 'thu',
      start: '09:00',
      end: '12:00',
      title: week('events.familyCheckIn'),
      professional: samples('staff5'),
      resident: samples('resident6'),
      unit: week('units.clinic'),
      professionalType: 'doctor' as const
    },
    {
      id: 'shift-08',
      dayKey: 'thu',
      start: '13:00',
      end: '17:00',
      title: week('events.mobilityTraining'),
      professional: samples('staff6'),
      resident: samples('resident2'),
      unit: week('units.gym'),
      professionalType: 'physiotherapist' as const
    },
    {
      id: 'shift-09',
      dayKey: 'fri',
      start: '06:00',
      end: '10:00',
      title: week('events.breakfastAndMeds'),
      professional: samples('staff4'),
      resident: samples('resident3'),
      unit: week('units.wingNorth'),
      professionalType: 'caregiver' as const
    },
    {
      id: 'shift-10',
      dayKey: 'fri',
      start: '10:00',
      end: '14:00',
      title: week('events.woundCareRound'),
      professional: samples('staff3'),
      resident: samples('resident4'),
      unit: week('units.wingSouth'),
      professionalType: 'nurse' as const
    },
    {
      id: 'shift-11',
      dayKey: 'sat',
      start: '08:00',
      end: '12:00',
      title: week('events.weekendRoutine'),
      professional: samples('staff8'),
      resident: samples('resident5'),
      unit: week('units.wingSouth'),
      professionalType: 'caregiver' as const
    },
    {
      id: 'shift-12',
      dayKey: 'sat',
      start: '12:00',
      end: '16:00',
      title: week('events.functionalExercises'),
      professional: samples('staff6'),
      resident: samples('resident6'),
      unit: week('units.gym'),
      professionalType: 'physiotherapist' as const
    },
    {
      id: 'shift-13',
      dayKey: 'sun',
      start: '09:00',
      end: '13:00',
      title: week('events.weekendReview'),
      professional: samples('staff7'),
      resident: samples('resident1'),
      unit: week('units.wingNorth'),
      professionalType: 'nurse' as const
    },
    {
      id: 'shift-14',
      dayKey: 'sun',
      start: '14:00',
      end: '18:00',
      title: week('events.dischargePlanning'),
      professional: samples('staff5'),
      resident: samples('resident2'),
      unit: week('units.clinic'),
      professionalType: 'doctor' as const
    }
  ];

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <section>
        <h2>{s('calendar')}</h2>
        <Card className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="schedule-date" label={bp('filters.date')}>
              <Input id="schedule-date" type="date" />
            </FormField>
            <FormField id="schedule-shift" label={bp('filters.shift')}>
              <Select id="schedule-shift" defaultValue="day">
                <option value="day">{uiOptions('shiftDay')}</option>
                <option value="night">{uiOptions('shiftNight')}</option>
              </Select>
            </FormField>
          </div>

          <ScheduleWeekView
            startHour={6}
            endHour={22}
            helperText={week('helper')}
            labels={{
              legend: week('labels.legend'),
              period: week('labels.period'),
              professional: week('labels.professional'),
              resident: week('labels.resident'),
              unit: week('labels.unit')
            }}
            days={days}
            shifts={shifts}
            legend={legend}
          />
        </Card>
      </section>
      <section>
        <h2>{s('closeMonth')}</h2>
        <DetailsSection title={bp('close.title')} defaultOpen={false}>
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
                  <div className="grid gap-1 text-sm text-ink-muted sm:grid-cols-3">
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
                    <Button type="button">
                      {bp('close.actions.markPaid')}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </DetailsSection>
      </section>
    </main>
  );
}
