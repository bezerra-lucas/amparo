import { render, screen } from '@testing-library/react';

import { Select } from '@/components/ui/select/select';

describe('Select', () => {
  it('renders options', () => {
    render(
      <Select aria-label="x">
        <option value="a">a</option>
      </Select>
    );

    expect(screen.getByLabelText('x')).toBeInTheDocument();
    expect(screen.getByText('a')).toBeInTheDocument();
  });
});
