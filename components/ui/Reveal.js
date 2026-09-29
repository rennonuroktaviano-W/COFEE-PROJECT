"use client";

import { useReveal } from "@/lib/useReveal";

/**
 * Declarative wrapper around {@link useReveal}.
 *
 * @param {{
 *   children: React.ReactNode,
 *   as?: import('react').ElementType,
 *   delay?: number,
 *   variant?: 'default' | 'mask',
 *   distance?: string,
 *   className?: string,
 *   id?: string,
 * }} props
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "default",
  distance,
  className = "",
  ...rest
}) {
  const [ref, isVisible] = useReveal();

  const classes = [
    variant === "mask" ? "mask-reveal" : "reveal",
    isVisible ? "is-visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={ref}
      className={classes}
      style={{ "--reveal-delay": `${delay}ms`, ...(distance ? { "--reveal-y": distance } : null) }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
