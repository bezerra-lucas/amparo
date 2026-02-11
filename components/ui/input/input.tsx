import { cn } from '@/lib/cn';

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'min-h-11 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink-strong shadow-sm transition-colors duration-200 placeholder:text-ink-subtle focus-visible:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300/80',
        className
      )}
    />
  );
}
