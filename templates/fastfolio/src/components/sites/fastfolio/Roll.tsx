import { Arrow } from "./Icons";

const external = (href: string) => /^https?:/.test(href);

// The label is stacked twice so hover can slide the second copy into place.
export function Roll({ href, label, solid, arrow, small, download }: { href: string; label: string; solid?: boolean; arrow?: boolean; small?: boolean; download?: boolean }) {
  return (
    <a className={`ff-btn${solid ? " ff-btn-solid" : ""}${small ? " ff-btn-small" : ""}`} href={href} download={download || undefined} target={external(href) ? "_blank" : undefined} rel={external(href) ? "noreferrer" : undefined}>
      <span className="ff-roll" data-text={label}>
        <span>{label}</span>
      </span>
      {arrow ? <Arrow /> : null}
    </a>
  );
}
