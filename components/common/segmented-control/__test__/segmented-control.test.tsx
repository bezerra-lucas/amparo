import { fireEvent, render, screen } from '@testing-library/react';

import { SegmentedControl } from '@/components/common/segmented-control/segmented-control';

describe('SegmentedControl', () => {
  it('renders single selected option with pressed state', () => {
    render(
      <SegmentedControl
        ariaLabel="Role"
        value="nurse"
        options={[
          { value: 'nurse', label: 'Nurse' },
          { value: 'caregiver', label: 'Caregiver' }
        ]}
      />
    );

    expect(screen.getByRole('group', { name: 'Role' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nurse' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Caregiver' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('calls onValueChange for button options', () => {
    const calls: string[] = [];
    const onValueChange = (nextValue: string) => {
      calls.push(nextValue);
    };

    render(
      <SegmentedControl
        ariaLabel="Role"
        value="nurse"
        onValueChange={onValueChange}
        options={[
          { value: 'nurse', label: 'Nurse' },
          { value: 'caregiver', label: 'Caregiver' }
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Caregiver' }));

    expect(calls).toEqual(['caregiver']);
  });

  it('renders link options when href is provided', () => {
    render(
      <SegmentedControl
        ariaLabel="Role"
        value="caregiver"
        options={[
          { value: 'nurse', label: 'Nurse', href: '/shift?role=nurse' },
          {
            value: 'caregiver',
            label: 'Caregiver',
            href: '/shift?role=caregiver'
          }
        ]}
      />
    );

    expect(screen.getByRole('link', { name: 'Nurse' })).toHaveAttribute(
      'href',
      '/shift?role=nurse'
    );
    expect(screen.getByRole('link', { name: 'Caregiver' })).toHaveAttribute(
      'href',
      '/shift?role=caregiver'
    );
  });

  it('supports arrow key focus navigation', () => {
    render(
      <SegmentedControl
        ariaLabel="Role"
        value="nurse"
        options={[
          { value: 'nurse', label: 'Nurse' },
          { value: 'caregiver', label: 'Caregiver' }
        ]}
      />
    );

    const group = screen.getByRole('group', { name: 'Role' });
    const nurseButton = screen.getByRole('button', { name: 'Nurse' });
    const caregiverButton = screen.getByRole('button', { name: 'Caregiver' });

    nurseButton.focus();
    fireEvent.keyDown(group, { key: 'ArrowRight' });

    expect(caregiverButton).toHaveFocus();
  });
});
