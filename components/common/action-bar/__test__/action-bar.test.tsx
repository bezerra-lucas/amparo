import { render, screen } from '@testing-library/react';

import { ActionBar } from '@/components/common/action-bar/action-bar';

describe('ActionBar', () => {
  it('renders children in mobile action container', () => {
    render(
      <ActionBar data-testid="action-bar">
        <button type="button">Salvar</button>
      </ActionBar>
    );

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    expect(screen.getByTestId('action-bar')).toHaveClass('fixed', 'sm:hidden');
  });

  it('applies custom content classes', () => {
    render(
      <ActionBar contentClassName="justify-end">
        <button type="button">Fechar</button>
      </ActionBar>
    );

    expect(
      screen.getByRole('button', { name: 'Fechar' }).parentElement
    ).toHaveClass('justify-end');
  });
});
