/**
 * Explicit marker for content that has not been confirmed by the client.
 *
 * PRD 12 forbids inventing menu items, prices, addresses, opening hours or
 * social accounts, and PRD 13 requires every unverified fact to be visibly
 * flagged. This component is the single place that flag is rendered, so the
 * notice can be removed globally once real data lands in /data.
 */
export function PlaceholderNotice({ children, tone = "dark", className = "" }) {
  const toneClass =
    tone === "light"
      ? "border-cream/25 text-beige/80"
      : "border-olive/35 text-olive";

  return (
    <p
      className={`label flex items-start gap-2.5 border ${toneClass} px-3.5 py-2.5 leading-relaxed ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className="mt-px inline-block size-1.5 shrink-0 rounded-full bg-current opacity-70"
      />
      <span>{children}</span>
    </p>
  );
}

export default PlaceholderNotice;
