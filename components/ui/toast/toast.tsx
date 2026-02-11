import { cn } from '@/lib/cn';

type ToastVariant = 'default' | 'success' | 'warning' | 'danger';

const variantClasses: Record<ToastVariant, string> = {
  default: 'border-line/80 bg-surface text-ink-strong',
  success: 'border-emerald-300/80 bg-emerald-50/80 text-emerald-800',
  warning: 'border-amber-300/80 bg-amber-50/80 text-amber-800',
  danger: 'border-rose-300/80 bg-rose-50/80 text-rose-800'
};

const indicatorClasses: Record<ToastVariant, string> = {
  default: 'bg-brand-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500'
};

export function Toast({
  className,
  variant = 'default',
  title,
  description,
  action,
  children,
  role,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: ToastVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  const announcedRole = role ?? (variant === 'danger' ? 'alert' : 'status');

  return (
    <div
      {...props}
      role={announcedRole}
      aria-live={announcedRole === 'alert' ? 'assertive' : 'polite'}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border px-4 py-3 shadow-panel',
        variantClasses[variant],
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
          indicatorClasses[variant]
        )}
      />

      <div className="min-w-0 flex-1 space-y-1">
        {title ? (
          <p className="text-sm font-semibold leading-5 text-current">
            {title}
          </p>
        ) : null}
        {description ? (
          <p className="text-sm leading-5 text-current/85">{description}</p>
        ) : null}
        {children}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
