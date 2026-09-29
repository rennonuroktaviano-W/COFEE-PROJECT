/**
 * Small uppercase section marker used above every section heading (PRD 4.3).
 * `tone` switches the colour so the component works on both the cream and
 * espresso backgrounds without per-section overrides.
 */
export function SectionLabel({ children, index, tone = "dark", className = "" }) {
  const toneClass =
    tone === "light" ? "text-beige/70" : tone === "olive" ? "text-olive" : "text-roasted/80";

  return (
    <p className={`label flex items-center gap-3 ${toneClass} ${className}`.trim()}>
      {index ? (
        <span aria-hidden="true" className="h-px w-8 bg-current opacity-45" />
      ) : null}
      <span>{children}</span>
    </p>
  );
}

export default SectionLabel;
