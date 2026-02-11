import { render, screen } from '@testing-library/react';

import { EmptyState } from '@/components/common/empty-state/empty-state';

describe('EmptyState', () => {
  it('renders title, description and action', () => {
    render(
      <EmptyState
        title="Sem dados"
        description="Nenhum resultado encontrado"
        action={<button type="button">Atualizar</button>}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Sem dados' })
    ).toBeInTheDocument();
    expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Atualizar' })
    ).toBeInTheDocument();
  });

  it('renders optional icon', () => {
    render(
      <EmptyState
        title="Sem itens"
        icon={<span data-testid="empty-icon">i</span>}
      />
    );

    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
  });
});
