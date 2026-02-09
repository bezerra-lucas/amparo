import { render, screen } from '@testing-library/react';

import { Input } from '@/components/ui/input/input';

describe('Input', () => {
  it('renders', () => {
    render(<Input aria-label="x" />);
    expect(screen.getByLabelText('x')).toBeInTheDocument();
  });
});
