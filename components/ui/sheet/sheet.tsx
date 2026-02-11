'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { cn } from '@/lib/cn';

const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;
const SheetPortal = Dialog.Portal;

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <Dialog.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-40 bg-ink/45 transition-opacity duration-200',
        'data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
        className
      )}
      {...props}
    />
  );
});

type SheetContentProps = React.ComponentPropsWithoutRef<
  typeof Dialog.Content
> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
};

const sideClasses: Record<NonNullable<SheetContentProps['side']>, string> = {
  top: 'inset-x-0 top-0 border-b data-[state=open]:translate-y-0 data-[state=closed]:-translate-y-full',
  right:
    'inset-y-0 right-0 h-full w-80 max-w-[85vw] border-l data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full',
  bottom:
    'inset-x-0 bottom-0 border-t data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full',
  left: 'inset-y-0 left-0 h-full w-80 max-w-[85vw] border-r data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full'
};

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof Dialog.Content>,
  SheetContentProps
>(function SheetContent(
  { className, side = 'right', children, ...props },
  ref
) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(
          'fixed z-50 border-line bg-canvas p-6 shadow-[0_20px_45px_rgba(15,23,42,0.24)]',
          'transition-transform duration-200 focus-visible:outline-none',
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </SheetPortal>
  );
});

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return <Dialog.Title ref={ref} className={cn(className)} {...props} />;
});

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return <Dialog.Description ref={ref} className={cn(className)} {...props} />;
});

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger
};
