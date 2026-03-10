type StatusPillProps = {
  label: string;
  value: string;
  tone?: "ok" | "warn" | "neutral";
};

export function StatusPill({ label, value, tone = "neutral" }: StatusPillProps) {
  return (
    <div className={`pill pill-${tone}`}>
      <span>{label}: </span>
      <strong>{value}</strong>
    </div>
  );
}
