'use client';

import Link from 'next/link';
import { useMemo, useRef } from 'react';

import { cn } from '@/lib/cn';

export type SegmentedControlOption<TValue extends string = string> = {
  value: TValue;
  label: React.ReactNode;
  href?: string;
  disabled?: boolean;
};

export function SegmentedControl<TValue extends string = string>({
  ariaLabel,
  value,
  options,
  onValueChange,
  className
}: {
  ariaLabel: string;
  value: TValue;
  options: Array<SegmentedControlOption<TValue>>;
  onValueChange?: (nextValue: TValue) => void;
  className?: string;
}) {
  const groupRef = useRef<HTMLDivElement>(null);

  const focusableSelector = useMemo(
    () =>
      '[data-segmented-control-option]:not([aria-disabled="true"]):not([disabled])',
    []
  );

  function focusByOffset(offset: number) {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const focusableOptions = Array.from(
      group.querySelectorAll<HTMLElement>(focusableSelector)
    );

    if (focusableOptions.length === 0) {
      return;
    }

    const activeIndex = focusableOptions.findIndex(
      (option) => option === document.activeElement
    );
    const currentIndex = activeIndex >= 0 ? activeIndex : 0;
    const nextIndex =
      (currentIndex + offset + focusableOptions.length) %
      focusableOptions.length;

    focusableOptions[nextIndex]?.focus();
  }

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex flex-wrap items-center gap-1 rounded-lg border border-line bg-canvas p-1',
        className
      )}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          focusByOffset(1);
        }

        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          focusByOffset(-1);
        }

        if (event.key === 'Home') {
          event.preventDefault();
          const firstOption =
            groupRef.current?.querySelector<HTMLElement>(focusableSelector);
          firstOption?.focus();
        }

        if (event.key === 'End') {
          event.preventDefault();
          const focusableOptions = Array.from(
            groupRef.current?.querySelectorAll<HTMLElement>(
              focusableSelector
            ) ?? []
          );
          focusableOptions.at(-1)?.focus();
        }
      }}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        const optionClassName = cn(
          'inline-flex min-h-10 items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300/80 disabled:cursor-not-allowed disabled:opacity-60',
          isSelected
            ? 'border-brand-700 bg-brand-600 text-brand-50 shadow-sm'
            : 'border-transparent bg-transparent text-ink-strong hover:bg-brand-50',
          option.disabled && 'pointer-events-none opacity-60'
        );

        if (option.href) {
          return (
            <Link
              key={option.value}
              href={option.href}
              role="button"
              aria-pressed={isSelected}
              aria-disabled={option.disabled}
              data-segmented-control-option
              className={optionClassName}
              tabIndex={option.disabled ? -1 : undefined}
            >
              {option.label}
            </Link>
          );
        }

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            disabled={option.disabled}
            data-segmented-control-option
            className={optionClassName}
            onClick={() => onValueChange?.(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
