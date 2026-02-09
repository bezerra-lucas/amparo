import { render, screen } from '@testing-library/react';

import { Button } from '@/components/ui/button/button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>ok</Button>);
    expect(screen.getByRole('button', { name: 'ok' })).toBeInTheDocument();
  });
});
