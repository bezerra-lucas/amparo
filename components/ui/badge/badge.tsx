import { cn } from '@/lib/cn';

type BadgeVariant = 'default' | 'muted' | 'success' | 'warning' | 'danger';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-slate-200 text-slate-700',
  muted: 'border-slate-200 text-slate-500',
  success: 'border-emerald-200 text-emerald-700',
  warning: 'border-amber-200 text-amber-700',
  danger: 'border-rose-200 text-rose-700'
};

export function Badge({
  variant = 'default',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center rounded border bg-white px-2 py-0.5 text-xs',
        variantClasses[variant],
        className
      )}
    />
  );
}
