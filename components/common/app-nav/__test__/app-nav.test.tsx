import { render, screen } from '@testing-library/react';
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
    expect(screen.getByText('nav.adminUsers')).toBeInTheDocument();
    expect(screen.getByText('nav.adminAudit')).toBeInTheDocument();
  });

  it('does not render mobile sidebar controls', () => {
    render(<AppNav />);

    expect(
      screen.queryByRole('button', { name: 'common.openNavMenu' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'common.closeNavMenu' })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('common.menuTitle')).not.toBeInTheDocument();
  });
});
