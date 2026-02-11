import { cn } from '@/lib/cn';

export function DetailsSection({
  title,
  defaultOpen,
  className,
  children
}: {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        'rounded-xl border border-line/80 bg-surface shadow-panel',
        className
      )}
    >
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-ink-strong marker:text-brand-600">
        {title}
      </summary>
      <div className="border-t border-line/80 px-4 py-3">{children}</div>
    </details>
  );
}
