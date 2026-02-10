import { render, screen } from '@testing-library/react';

import { DetailsSection } from '@/components/common/details-section/details-section';

describe('DetailsSection', () => {
  it('renders title and children', () => {
    render(
      <DetailsSection title="Title">
        <div>Child</div>
      </DetailsSection>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
