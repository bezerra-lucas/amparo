import { render, screen } from '@testing-library/react';

import { Card } from '@/components/ui/card/card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <div>child</div>
      </Card>
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
