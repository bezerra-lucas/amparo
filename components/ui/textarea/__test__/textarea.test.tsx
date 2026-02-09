import { render, screen } from '@testing-library/react';

import { Textarea } from '@/components/ui/textarea/textarea';

describe('Textarea', () => {
  it('renders', () => {
    render(<Textarea aria-label="x" />);
    expect(screen.getByLabelText('x')).toBeInTheDocument();
  });
});
