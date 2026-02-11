import { render, screen } from '@testing-library/react';

import { ScheduleWeekView } from '@/components/pages/schedule-week-view/schedule-week-view';

describe('ScheduleWeekView', () => {
  it('renders weekly headers and shifts with role colors', () => {
    render(
      <ScheduleWeekView
        startHour={6}
        endHour={22}
        helperText="Escala semanal"
        labels={{
          legend: 'Legenda',
          period: 'Horario',
          professional: 'Profissional',
          resident: 'Residente',
          unit: 'Setor'
        }}
        legend={[
          { type: 'nurse', label: 'Enfermeira' },
          { type: 'caregiver', label: 'Cuidador' }
        ]}
        days={[
          { key: 'mon', label: 'Seg', dateLabel: '10/02' },
          { key: 'tue', label: 'Ter', dateLabel: '11/02' },
          { key: 'wed', label: 'Qua', dateLabel: '12/02' },
          { key: 'thu', label: 'Qui', dateLabel: '13/02' },
          { key: 'fri', label: 'Sex', dateLabel: '14/02' },
          { key: 'sat', label: 'Sab', dateLabel: '15/02' },
          { key: 'sun', label: 'Dom', dateLabel: '16/02' }
        ]}
        shifts={[
          {
            id: 's1',
            dayKey: 'mon',
            start: '07:00',
            end: '11:00',
            title: 'Ronda de medicacao',
            professional: 'Julia Mendes',
            resident: 'Residente Exemplo 01',
            unit: 'Ala Norte',
            professionalType: 'nurse'
          },
          {
            id: 's2',
            dayKey: 'tue',
            start: '13:00',
            end: '17:00',
            title: 'Acompanhamento de rotina',
            professional: 'Lucas Nunes',
            resident: 'Residente Exemplo 02',
            unit: 'Ala Sul',
            professionalType: 'caregiver'
          }
        ]}
      />
    );

    expect(screen.getByText('Seg')).toBeInTheDocument();
    expect(screen.getByText('Ter')).toBeInTheDocument();
    expect(screen.getByText('Ronda de medicacao')).toBeInTheDocument();
    expect(screen.getByText('Acompanhamento de rotina')).toBeInTheDocument();

    const nurseLegend = screen.getByText('Enfermeira');
    const caregiverLegend = screen.getByText('Cuidador');

    expect(nurseLegend.className).toContain('border-sky-300');
    expect(caregiverLegend.className).toContain('border-emerald-300');
  });
});
