import { render, screen } from '@testing-library/react';
import { AppShell } from '@/components/common/app-shell/app-shell';

describe('AppShell', () => {
  it('renders children', () => {
    render(
      <AppShell>
        <div>child</div>
      </AppShell>
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
