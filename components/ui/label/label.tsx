import { cn } from '@/lib/cn';

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={cn('text-sm font-medium text-slate-900', className)}
    />
  );
}
