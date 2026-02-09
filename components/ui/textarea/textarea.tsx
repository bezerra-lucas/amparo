import { cn } from '@/lib/cn';

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'min-h-24 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm',
        className
      )}
    />
  );
}
