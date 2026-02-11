import { cn } from '@/lib/cn';
import { Label } from '@/components/ui/label/label';

export function FormField({
  id,
  label,
  hint,
  className,
  children
}: {
  id: string;
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('space-y-1', className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}
