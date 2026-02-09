import { render, screen } from '@testing-library/react';

import { FormField } from '@/components/common/form-field/form-field';

describe('FormField', () => {
  it('renders label and children', () => {
    render(
      <FormField id="x" label="Label">
        <input id="x" aria-label="x" />
      </FormField>
    );

    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(screen.getByLabelText('x')).toBeInTheDocument();
  });
});
