import { render, screen } from '@testing-library/react';

import { PageHeader } from '@/components/common/page-header/page-header';

describe('PageHeader', () => {
  it('renders title and subtitle', () => {
    render(<PageHeader title="t" subtitle="s" />);
    expect(screen.getByRole('heading', { name: 't' })).toBeInTheDocument();
    expect(screen.getByText('s')).toBeInTheDocument();
  });
});
