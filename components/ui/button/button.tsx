import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-brand-700 bg-brand-600 text-brand-50 shadow-sm hover:bg-brand-700 hover:shadow-soft',
  secondary:
    'border-line bg-canvas text-ink-strong hover:border-brand-300 hover:bg-brand-50',
  ghost: 'border-transparent bg-transparent text-brand-700 hover:bg-brand-50'
};

export function Button({
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300/80 disabled:cursor-not-allowed disabled:opacity-65',
        variantClasses[variant],
        className
      )}
    />
  );
}
