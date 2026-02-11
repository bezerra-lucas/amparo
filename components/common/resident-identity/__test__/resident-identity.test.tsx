import { render, screen } from '@testing-library/react';

import { ResidentIdentity } from '@/components/common/resident-identity/resident-identity';

describe('ResidentIdentity', () => {
  it('renders resident name and avatar', () => {
    render(<ResidentIdentity name="Pessoa Exemplo" />);

    expect(screen.getByText('Pessoa Exemplo')).toBeInTheDocument();
    expect(screen.getByTestId('resident-avatar')).toBeInTheDocument();
  });

  it('supports medium avatar size', () => {
    render(<ResidentIdentity name="Pessoa Exemplo" size="md" />);

    expect(screen.getByTestId('resident-avatar').className).toContain('h-12');
    expect(screen.getByTestId('resident-avatar').className).toContain('w-12');
  });
});
