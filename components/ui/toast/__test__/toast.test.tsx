import { render, screen } from '@testing-library/react';

import { Toast } from '@/components/ui/toast/toast';

describe('Toast', () => {
  it('renders title and description with status role', () => {
    render(<Toast title="Salvo" description="Alteracoes aplicadas" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Salvo')).toBeInTheDocument();
    expect(screen.getByText('Alteracoes aplicadas')).toBeInTheDocument();
  });

  it('uses alert role for danger variant', () => {
    render(<Toast variant="danger" title="Erro" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders an action slot', () => {
    render(
      <Toast
        action={<button type="button">Tentar novamente</button>}
        title="Falha"
      />
    );

    expect(
      screen.getByRole('button', { name: 'Tentar novamente' })
    ).toBeInTheDocument();
  });
});
