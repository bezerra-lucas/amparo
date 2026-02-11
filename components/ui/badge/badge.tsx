import { cn } from '@/lib/cn';

type BadgeVariant = 'default' | 'muted' | 'success' | 'warning' | 'danger';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-brand-200 bg-brand-50 text-brand-800',
  muted: 'border-line bg-canvas text-ink-muted',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700'
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
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    />
  );
}
