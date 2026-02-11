export function PageHeader({
  title,
  subtitle
}: {
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <header className="space-y-2">
      <h1>{title}</h1>
      {subtitle ? (
        <p className="max-w-3xl text-sm text-ink-muted sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
