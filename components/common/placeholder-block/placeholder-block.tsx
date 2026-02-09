export function PlaceholderBlock({ title }: { title: string }) {
  return (
    <div className="rounded border border-dashed border-slate-300 bg-white p-3">
      <pre className="whitespace-pre-wrap text-xs text-slate-700">{title}</pre>
    </div>
  );
}
