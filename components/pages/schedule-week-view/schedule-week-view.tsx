import { cn } from '@/lib/cn';

import { ResidentIdentity } from '@/components/common/resident-identity/resident-identity';

type ProfessionalType = 'nurse' | 'caregiver' | 'doctor' | 'physiotherapist';

type ScheduleDay = {
  key: string;
  label: string;
  dateLabel: string;
};

type ScheduleShift = {
  id: string;
  dayKey: string;
  start: string;
  end: string;
  title: string;
  professional: string;
  resident: string;
  unit: string;
  professionalType: ProfessionalType;
};

type ScheduleLegendItem = {
  type: ProfessionalType;
  label: string;
};

const professionalTypeClasses: Record<ProfessionalType, string> = {
  nurse: 'border-sky-300 bg-sky-50 text-sky-900',
  caregiver: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  doctor: 'border-rose-300 bg-rose-50 text-rose-900',
  physiotherapist: 'border-amber-300 bg-amber-50 text-amber-900'
};

const HOUR_HEIGHT = 64;

function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function ScheduleWeekView({
  days,
  shifts,
  legend,
  startHour,
  endHour,
  helperText,
  labels
}: {
  days: ScheduleDay[];
  shifts: ScheduleShift[];
  legend: ScheduleLegendItem[];
  startHour: number;
  endHour: number;
  helperText: string;
  labels: {
    legend: string;
    period: string;
    professional: string;
    resident: string;
    unit: string;
  };
}) {
  const hourMarks = Array.from(
    { length: endHour - startHour + 1 },
    (_, idx) => startHour + idx
  );
  const timelineHeight = (endHour - startHour) * HOUR_HEIGHT;
  const dayByKey = new Set(days.map((day) => day.key));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p>{helperText}</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-semibold text-slate-900">
            {labels.legend}
          </span>
          {legend.map((item) => (
            <span
              key={item.type}
              className={cn(
                'inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium',
                professionalTypeClasses[item.type]
              )}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-slate-200 bg-white">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b border-slate-200">
            <div className="border-r border-slate-200 bg-slate-50" />
            {days.map((day) => (
              <div
                key={day.key}
                className="border-r border-slate-200 bg-slate-50 px-3 py-2 text-center last:border-r-0"
              >
                <div className="text-sm font-semibold text-slate-900">
                  {day.label}
                </div>
                <div className="text-xs text-slate-600">{day.dateLabel}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))]">
            <div
              className="relative border-r border-slate-200 bg-slate-50"
              style={{ height: timelineHeight }}
            >
              {hourMarks.map((hour, idx) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 border-t border-slate-200"
                  style={{ top: idx * HOUR_HEIGHT }}
                >
                  <span className="absolute left-2 top-0 -translate-y-1/2 text-xs text-slate-500">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>

            {days.map((day) => {
              const dayShifts = shifts
                .filter(
                  (shift) =>
                    dayByKey.has(shift.dayKey) && shift.dayKey === day.key
                )
                .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

              return (
                <div
                  key={day.key}
                  className="relative border-r border-slate-200 last:border-r-0"
                  style={{ height: timelineHeight }}
                >
                  {hourMarks.map((hour, idx) => (
                    <div
                      key={`${day.key}-${hour}`}
                      className="absolute left-0 right-0 border-t border-slate-200"
                      style={{ top: idx * HOUR_HEIGHT }}
                    />
                  ))}

                  {dayShifts.map((shift) => {
                    const startMinutes = toMinutes(shift.start);
                    const endMinutes = toMinutes(shift.end);
                    const startOffset = startMinutes - startHour * 60;
                    const duration = Math.max(endMinutes - startMinutes, 45);

                    return (
                      <article
                        key={shift.id}
                        className={cn(
                          'absolute left-2 right-2 overflow-hidden rounded border px-2 py-1 text-xs shadow-sm',
                          professionalTypeClasses[shift.professionalType]
                        )}
                        style={{
                          top: (startOffset / 60) * HOUR_HEIGHT + 2,
                          height: (duration / 60) * HOUR_HEIGHT - 4
                        }}
                      >
                        <p className="truncate font-semibold">{shift.title}</p>
                        <p className="truncate">
                          {labels.period}: {shift.start} - {shift.end}
                        </p>
                        <p className="truncate">
                          {labels.professional}: {shift.professional}
                        </p>
                        <p className="flex min-w-0 items-center gap-1 truncate">
                          <span>{labels.resident}:</span>
                          <ResidentIdentity
                            name={shift.resident}
                            size="sm"
                            className="min-w-0 gap-1"
                          />
                        </p>
                        <p className="truncate">
                          {labels.unit}: {shift.unit}
                        </p>
                      </article>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
