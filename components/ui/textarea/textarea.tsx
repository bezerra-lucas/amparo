import { cn } from '@/lib/cn';

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'min-h-24 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink-strong shadow-sm transition-colors duration-200 placeholder:text-ink-subtle focus-visible:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300/80',
        className
      )}
    />
  );
}
