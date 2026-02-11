import { cn } from '@/lib/cn';

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-xl border border-line/80 bg-surface p-4 shadow-panel transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft',
        className
      )}
    />
  );
}
