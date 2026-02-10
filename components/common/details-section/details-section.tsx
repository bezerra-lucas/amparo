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
      className={cn('rounded border border-slate-200 bg-white', className)}
    >
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold">
        {title}
      </summary>
      <div className="border-t border-slate-200 px-4 py-3">{children}</div>
    </details>
  );
}
