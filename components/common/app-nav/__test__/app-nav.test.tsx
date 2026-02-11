import { fireEvent, render, screen } from '@testing-library/react';
import { AppNav } from '@/components/common/app-nav/app-nav';

describe('AppNav', () => {
  it('renders translated links', () => {
    render(<AppNav />);

    expect(screen.getByText('nav.shift')).toBeInTheDocument();
    expect(screen.getByText('nav.dashboard')).toBeInTheDocument();
    expect(screen.getByText('nav.financial')).toBeInTheDocument();
    expect(screen.getByText('nav.residents')).toBeInTheDocument();
    expect(screen.getByText('nav.medications')).toBeInTheDocument();
    expect(screen.getByText('nav.schedule')).toBeInTheDocument();
  });

  it('opens and closes the mobile sidebar', () => {
    render(<AppNav />);

    expect(screen.queryByText('common.menuTitle')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'common.openNavMenu' }));

    expect(screen.getByText('common.menuTitle')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'common.closeNavMenu' })
    );

    expect(screen.queryByText('common.menuTitle')).not.toBeInTheDocument();
  });
});
