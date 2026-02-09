import { cn } from '@/lib/cn';

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'min-h-11 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm',
        className
      )}
    />
  );
}
