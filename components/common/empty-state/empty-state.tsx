import { cn } from '@/lib/cn';

export function EmptyState({
  className,
  title,
  description,
  icon,
  action,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-xl border border-dashed border-line-strong/70 bg-surface/95 p-6 text-center shadow-panel',
        className
      )}
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
        {icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-700">
            {icon}
          </div>
        ) : null}
        <div className="space-y-1">
          <h2 className="text-base">{title}</h2>
          {description ? <p className="text-sm">{description}</p> : null}
        </div>
        {action ? <div className="pt-1">{action}</div> : null}
      </div>
    </div>
  );
}
