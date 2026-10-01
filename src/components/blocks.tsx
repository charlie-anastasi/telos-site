import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

/** A value for [mobile, desktop], or one value used at both. Desktop starts at 768px. */
type Responsive<T> = T | [T, T];

const at = <T,>(value: Responsive<T>, index: 0 | 1): T => (Array.isArray(value) ? value[index] : value);

type Theme = "bright" | "white-bold" | "light-bold" | "white";

type SectionProps = {
  theme: Theme;
  /** Anchor target, e.g. "modernwork" for /#modernwork. */
  id?: string;
  /** Minimum height in vh. */
  minHeight?: number;
  /** Top and bottom padding in tenths of a vmax. */
  pad?: number;
  /** Preset height instead of minHeight/pad. */
  height?: "medium";
  /**
   * Rounded bottom edge that overlaps the next section: corners curve up, or
   * down with "flip". Needs a z above the sections after it.
   */
  divider?: boolean | "flip";
  z?: number;
  /** Full-bleed background image. */
  bg?: string;
  bgFocus?: string;
  children: ReactNode;
};

export function Section({ theme, id, minHeight, pad, height, divider, z, bg, bgFocus, children }: SectionProps) {
  const className = ["section", `theme-${theme}`, height && `section--${height}`, divider && "section--divider", divider === "flip" && "section--divider-flip"]
    .filter(Boolean)
    .join(" ");
  const style = { "--min-height": minHeight, "--pad": pad, zIndex: z } as CSSProperties;
  return (
    <section id={id} className={className} style={style}>
      <div className="section-bg">
        {bg && <Image src={bg} alt="" fill sizes="100vw" style={{ objectPosition: bgFocus }} />}
      </div>
      <div className="section-wrap">{children}</div>
    </section>
  );
}

/** Rows in the 8-column mobile grid and the 24-column desktop grid. */
export function Grid({ rows, children }: { rows: [number, number]; children?: ReactNode }) {
  return (
    <div className="grid" style={{ "--rows-m": rows[0], "--rows-d": rows[1] } as CSSProperties}>
      {children}
    </div>
  );
}

const VERTICAL = { start: "flex-start", center: "center", end: "flex-end" } as const;

type BlockProps = {
  /** Grid placement as "row-start/col-start/row-end/col-end", [mobile, desktop]. */
  area: [string, string];
  z?: Responsive<number>;
  /** Vertical alignment of the content within the block's area. */
  v?: Responsive<keyof typeof VERTICAL>;
  /** Rotation in degrees. */
  rotate?: Responsive<number>;
  hide?: "mobile" | "desktop";
  children: ReactNode;
};

export function Block({ area, z = 0, v = "start", rotate = 0, hide, children }: BlockProps) {
  const style = {
    "--area-m": area[0],
    "--area-d": area[1],
    "--z-m": at(z, 0),
    "--z-d": at(z, 1),
    "--v-m": VERTICAL[at(v, 0)],
    "--v-d": VERTICAL[at(v, 1)],
    "--transform-m": at(rotate, 0) ? `rotate(${at(rotate, 0)}deg)` : undefined,
    "--transform-d": at(rotate, 1) ? `rotate(${at(rotate, 1)}deg)` : undefined,
  } as CSSProperties;
  return (
    <div className={hide ? `block block--hide-${hide}` : "block"} style={style}>
      {children}
    </div>
  );
}

/** Rich text. Children are ordinary headings, paragraphs and lists. */
export function Text({ children }: { children: ReactNode }) {
  return <div className="text">{children}</div>;
}

/** Hand-drawn underline beneath a word in a heading. `stroke` is its thickness (default 0.05em). */
export function Highlight({ stroke, children }: { stroke?: string; children: ReactNode }) {
  return (
    <span className="highlight" style={stroke ? ({ "--stroke": stroke } as CSSProperties) : undefined}>
      {children}
      <svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0,.99c.125-.0275,.25-.085,.5-.11c.25-.025,.38,0,.5,.01c.024,.002-.019,.0285-.02,.03"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

type ButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  /** Size to the label instead of filling the block. */
  fit?: boolean;
  align?: "left" | "center" | "right";
  newTab?: boolean;
  children: ReactNode;
};

export function Button({ href, variant = "primary", fit, align = "center", newTab, children }: ButtonProps) {
  const wrap = ["button-wrap", fit && "button-wrap--fit", align !== "center" && `button-wrap--${align}`]
    .filter(Boolean)
    .join(" ");
  const className = variant === "primary" ? "button" : `button button--${variant}`;
  const external = newTab ? { target: "_blank", rel: "noopener" } : {};
  return (
    <div className={wrap}>
      {href.startsWith("/") ? (
        <Link href={href} className={className} {...external}>
          {children}
        </Link>
      ) : (
        <a href={href} className={className} {...external}>
          {children}
        </a>
      )}
    </div>
  );
}

type PictureProps = {
  src: string;
  alt: string;
  fit?: Responsive<"cover" | "contain">;
  /** object-position, e.g. "48% 10%". */
  focus?: string;
  radius?: string;
  /** Color wash laid over the image. */
  overlay?: string;
  align?: "left" | "center" | "right";
  /** Load immediately instead of lazily; for images at the top of a page. */
  eager?: boolean;
  sizes?: string;
  href?: string;
};

export function Picture({ src, alt, fit = "cover", focus, radius, overlay, align, eager, sizes, href }: PictureProps) {
  const style = {
    "--fit-m": at(fit, 0),
    "--fit-d": at(fit, 1),
    // alignment only shows when the image is contained and narrower than its block
    "--focus": focus ?? (align && align !== "center" && at(fit, 1) === "contain" ? `${align} center` : undefined),
    "--radius": radius,
    "--overlay": overlay,
  } as CSSProperties;
  const picture = (
    <div className="picture" style={style}>
      <Image src={src} alt={alt} fill sizes={sizes} loading={eager ? "eager" : "lazy"} />
      {overlay && <div className="picture-overlay" />}
    </div>
  );
  return href ? <Link href={href}>{picture}</Link> : picture;
}

export function Rule() {
  return <hr className="rule" />;
}

/** Solid rectangle, used as a card behind other blocks. */
export function Shape() {
  return <div className="shape" />;
}
