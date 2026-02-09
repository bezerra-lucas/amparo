import { render, screen } from '@testing-library/react';

import { Label } from '@/components/ui/label/label';

describe('Label', () => {
  it('renders', () => {
    render(<Label>Label</Label>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });
});
