import { render, screen } from '@testing-library/react';

import { Badge } from '@/components/ui/badge/badge';

describe('Badge', () => {
  it('renders content', () => {
    render(<Badge>ok</Badge>);
    expect(screen.getByText('ok')).toBeInTheDocument();
  });
});
