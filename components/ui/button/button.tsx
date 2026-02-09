import clsx from 'clsx';

export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        'min-h-11 rounded border border-slate-300 bg-white px-4 py-2 text-sm',
        className
      )}
    />
  );
}
