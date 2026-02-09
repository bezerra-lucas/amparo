import { render, screen } from '@testing-library/react';
import { AppNav } from '@/components/common/app-nav/app-nav';

describe('AppNav', () => {
  it('renders translated links', () => {
    render(<AppNav />);

    expect(screen.getByText('nav.dashboard')).toBeInTheDocument();
    expect(screen.getByText('nav.residents')).toBeInTheDocument();
    expect(screen.getByText('nav.medications')).toBeInTheDocument();
    expect(screen.getByText('nav.schedule')).toBeInTheDocument();
  });
});
