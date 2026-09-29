const BASE =
  "label inline-flex items-center justify-center gap-2.5 rounded-full min-h-11 transition-[background-color,color,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform";

const VARIANTS = {
  primary:
    "bg-espresso text-cream hover:bg-roasted active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55",
  secondary:
    "border border-espresso/30 text-espresso hover:border-espresso hover:bg-espresso/5 active:translate-y-px",
  onDark:
    "border border-cream/35 text-cream hover:border-cream hover:bg-cream/10 active:translate-y-px",
  ghost: "text-espresso hover:text-roasted",
};

const SIZES = {
  md: "px-6 py-3 text-[0.7rem] md:text-xs",
  lg: "px-7 py-3.5 text-xs md:text-[0.8rem]",
};

/**
 * Single button primitive used across the landing page (PRD 11).
 *
 * Renders an <a> when `href` is supplied and a <button> otherwise, so anchor
 * CTAs keep real link semantics (middle-click, copy-link, screen readers).
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  icon = null,
  external = false,
  ...rest
}) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();

  const content = (
    <>
      <span>{children}</span>
      {icon ? (
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          {icon}
        </span>
      ) : null}
    </>
  );

  if (href) {
    const isExternal =
      external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

    return (
      <a
        href={href}
        className={`group ${classes}`}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : null)}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={`group ${classes}`} {...rest}>
      {content}
    </button>
  );
}

export default Button;
