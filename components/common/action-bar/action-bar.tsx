import { cn } from '@/lib/cn';

export function ActionBar({
  className,
  contentClassName,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  contentClassName?: string;
}) {
  return (
    <div
      {...props}
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-line/80 bg-canvas/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur sm:hidden',
        className
      )}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-6xl items-center gap-2',
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
