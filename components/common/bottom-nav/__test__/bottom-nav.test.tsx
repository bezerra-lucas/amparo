import { render, screen } from '@testing-library/react';

import {
  BottomNav,
  type BottomNavItem,
  defaultBottomNavItems
} from '@/components/common/bottom-nav/bottom-nav';

describe('BottomNav', () => {
  it('renders mobile nav with icon and label for each item', () => {
    render(<BottomNav />);

    expect(
      screen.getByRole('navigation', { name: 'common.appNavAriaLabel' })
    ).toBeInTheDocument();

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(defaultBottomNavItems.length);
    expect(screen.getByText('nav.dashboard')).toBeInTheDocument();
    expect(screen.getByText('nav.shift')).toBeInTheDocument();
    expect(screen.getByText('nav.residents')).toBeInTheDocument();
    expect(screen.getByText('nav.medications')).toBeInTheDocument();
    expect(screen.getByText('nav.schedule')).toBeInTheDocument();

    links.forEach((link) => {
      expect(link.querySelector('svg')).toBeInTheDocument();
    });
  });

  it('limits rendered links to five items', () => {
    const oversizedItems: BottomNavItem[] = [
      ...defaultBottomNavItems,
      { href: '/financial', label: 'dashboard', icon: 'dashboard' }
    ];

    render(<BottomNav items={oversizedItems} />);

    expect(screen.getAllByRole('link')).toHaveLength(5);
  });
});
