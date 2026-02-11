export function PlaceholderBlock({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed border-brand-300 bg-brand-50/60 p-3">
      <pre className="whitespace-pre-wrap text-xs leading-relaxed text-ink-muted">
        {title}
      </pre>
    </div>
  );
}
