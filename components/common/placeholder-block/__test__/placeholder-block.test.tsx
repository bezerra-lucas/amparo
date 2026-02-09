import { render, screen } from '@testing-library/react';

import { PlaceholderBlock } from '@/components/common/placeholder-block/placeholder-block';

describe('PlaceholderBlock', () => {
  it('renders title', () => {
    render(<PlaceholderBlock title="x" />);
    expect(screen.getByText('x')).toBeInTheDocument();
  });
});
