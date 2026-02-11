import { fireEvent, render, screen, within } from '@testing-library/react';

import { ShiftMar } from '@/components/pages/shift-mar/shift-mar';

const labels = {
  time: 'Horario',
  medication: 'Medicacao',
  dose: 'Dose',
  status: 'Status',
  reason: 'Motivo',
  statuses: {
    pending: 'Pendente',
    given: 'Administrado',
    notGiven: 'Nao administrado'
  },
  actions: {
    given: 'Administrado',
    notGiven: 'Nao administrado',
    save: 'Salvar checagens'
  },
  reasonSheet: {
    title: 'Informar motivo',
    description: 'Escolha o motivo para registrar a excecao.',
    reasonLabel: 'Motivo principal',
    noteLabel: 'Observacao',
    confirm: 'Confirmar motivo',
    cancel: 'Cancelar'
  },
  toast: {
    savedTitle: 'Checagens salvas',
    savedDescription: 'Status atualizado.'
  }
};

const reasonOptions = [
  { value: 'refusal', label: 'Recusa do residente' },
  { value: 'stock', label: 'Medicacao indisponivel' }
];

describe('ShiftMar', () => {
  it('marks medication as given from card action', () => {
    render(
      <ShiftMar
        items={[
          {
            id: '08',
            time: '08:00',
            medication: 'Med A',
            dose: '1 comp',
            status: 'pending'
          }
        ]}
        labels={labels}
        reasonOptions={reasonOptions}
      />
    );

    const marItem = screen.getByTestId('mar-item-08');
    expect(
      within(marItem).getByLabelText('Status: Pendente')
    ).toBeInTheDocument();

    fireEvent.click(
      within(marItem).getByRole('button', { name: 'Administrado' })
    );

    expect(
      within(marItem).getByLabelText('Status: Administrado')
    ).toBeInTheDocument();
  });

  it('opens reason sheet and confirms not administered reason', () => {
    render(
      <ShiftMar
        items={[
          {
            id: '14',
            time: '14:00',
            medication: 'Med B',
            dose: '1 comp',
            status: 'pending'
          }
        ]}
        labels={labels}
        reasonOptions={reasonOptions}
      />
    );

    const marItem = screen.getByTestId('mar-item-14');
    fireEvent.click(
      within(marItem).getByRole('button', { name: 'Nao administrado' })
    );

    expect(screen.getByText('Informar motivo')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Motivo principal'), {
      target: { value: 'stock' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar motivo' }));

    expect(
      within(marItem).getByLabelText('Status: Nao administrado')
    ).toBeInTheDocument();
    expect(
      within(marItem).getByText('Medicacao indisponivel')
    ).toBeInTheDocument();
  });

  it('shows success toast after saving checks', () => {
    render(
      <ShiftMar
        items={[
          {
            id: '20',
            time: '20:00',
            medication: 'Med C',
            dose: '1 comp',
            status: 'given'
          }
        ]}
        labels={labels}
        reasonOptions={reasonOptions}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Salvar checagens' }));

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Checagens salvas')).toBeInTheDocument();
  });
});
