export default function Loading() {
  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="glass-card p-4 rounded-2xl border border-brand-border h-24 animate-pulse" />
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="glass-card p-4 rounded-2xl border border-brand-border h-96 animate-pulse" />
        ))}
      </div>
    </div>
  );
}