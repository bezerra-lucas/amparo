import { fireEvent, render, screen } from '@testing-library/react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet/sheet';

describe('Sheet', () => {
  it('opens and closes via trigger and close button', () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <button type="button">open</button>
        </SheetTrigger>

        <SheetContent>
          <SheetTitle>menu</SheetTitle>
          <SheetDescription>menu description</SheetDescription>
          <SheetClose asChild>
            <button type="button">close</button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    );

    expect(screen.queryByText('menu')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'open' }));

    expect(screen.getByText('menu')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'close' }));

    expect(screen.queryByText('menu')).not.toBeInTheDocument();
  });
});
