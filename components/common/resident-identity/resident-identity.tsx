import { cn } from '@/lib/cn';

type ResidentIdentitySize = 'xs' | 'sm' | 'md' | 'lg';

const avatarSizes: Record<ResidentIdentitySize, string> = {
  xs: 'h-8 w-8',
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-14 w-14'
};

const iconSizes: Record<ResidentIdentitySize, string> = {
  xs: 'h-4 w-4',
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-7 w-7'
};

export function ResidentIdentity({
  name,
  size = 'sm',
  className,
  nameClassName
}: {
  name: string;
  size?: ResidentIdentitySize;
  className?: string;
  nameClassName?: string;
}) {
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2', className)}>
      <span
        data-testid="resident-avatar"
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-700',
          avatarSizes[size]
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={iconSizes[size]}
        >
          <circle
            cx="12"
            cy="8"
            r="4"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M5 19C5 15.6863 7.68629 13 11 13H13C16.3137 13 19 15.6863 19 19"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className={cn('min-w-0 truncate', nameClassName)}>{name}</span>
    </span>
  );
}
