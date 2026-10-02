type VillageMarkProps = {
  compact?: boolean;
  light?: boolean;
};

export function VillageMark({ compact = false, light = false }: VillageMarkProps) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Village home">
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        className="size-9 shrink-0"
        fill="none"
      >
        <rect x="2" y="2" width="36" height="36" rx="12" fill={light ? "#F8F5ED" : "#2F5944"} />
        <path d="M9 21.2 14.1 16l5.1 5.2v8H9v-8Z" fill={light ? "#2F5944" : "#F8F5ED"} />
        <path d="m19.1 18.6 5.2-5.3 6.7 6.8v9.1H19.1v-10.6Z" fill={light ? "#2F5944" : "#F8F5ED"} />
        <path d="M23.2 25.2h3.4v4h-3.4z" fill={light ? "#F8F5ED" : "#2F5944"} />
        <circle cx="12.3" cy="23.9" r="1" fill={light ? "#F8F5ED" : "#2F5944"} />
      </svg>
      {!compact ? (
        <span
          className={`font-display text-[1.55rem] font-semibold leading-none tracking-[-0.055em] ${light ? "text-background" : "text-foreground"}`}
        >
          Village
        </span>
      ) : null}
    </span>
  );
}
