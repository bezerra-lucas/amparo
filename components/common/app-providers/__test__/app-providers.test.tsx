import { render, screen } from '@testing-library/react';

import { AppProviders } from '@/components/common/app-providers/app-providers';

describe('AppProviders', () => {
  it('renders children', () => {
    render(
      <AppProviders>
        <div>child</div>
      </AppProviders>
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
