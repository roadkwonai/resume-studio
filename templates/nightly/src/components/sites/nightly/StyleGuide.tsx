import { site } from "./data";
import { PageHero } from "./ui";
import s from "./nl.module.css";

const SWATCHES = [["#0D0C0A", "1px solid var(--nl-line)"], ["#171512", ""], ["#F0ECE4", ""], ["#918D84", ""], ["#625F58", ""], ["#F0ECE424", ""], ["#FFB02E", ""]];
const TYPE_CLASSES = ["sgDisplay", "sgStatement", "sgHeading", "sgTitle", "sgFigure", "sgLead", "sgArticle", "sgBody", "sgLabel", "sgSmall", "sgLabel", "sgName"];
const CHIPS = [
  ["#0B0D10", "#14171C", "#E9EEF2", "#8A939C", "#5A626B", "#6EA8FF"],
  ["#100B0A", "#1A1312", "#F3E9E4", "#9A8C86", "#675B56", "#FF6B4A"],
  ["#F4F2EC", "#E8E5DC", "#15140F", "#6F6C64", "#A5A299", "#C2410C"],
];
const t = site.styleGuide;

function Section({ label, children, cls = "" }: { label: string; children: React.ReactNode; cls?: string }) {
  return (
    <section className={`${s.sgSec} ${cls}`}>
      <p className={s.label}>{label}</p>
      <div className={s.sgBody}>{children}</div>
    </section>
  );
}

/** A showcase of the design tokens with neutral samples: nothing here comes from a person's profile. */
export function StyleGuidePage() {
  return (
    <>
      <PageHero label={t.label} lead={t.lead} rest={t.rest} />
      <div style={{ height: 132 }} />
      <Section label={t.colours} cls={s.sgCol}>
        <div className={s.sgSwatches}>
          {t.colourRows.map(([n, d], i) => (
            <div key={n}>
              <div className={s.sgSwatch} style={{ background: SWATCHES[i][0], border: SWATCHES[i][1] || undefined }} />
              <div className={s.sgCap}>{n}</div>
              <div className={s.sgCapD}>{d}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section label={t.type} cls={s.sgType}>
        {t.typeRows.map(([n, d, sample], i) => (
          <div key={n} className={s.sgRow}>
            <span>{n}<em>{d}</em></span>
            <div className={s[TYPE_CLASSES[i] as keyof typeof s]}>{sample}</div>
          </div>
        ))}
      </Section>
      <Section label={t.palettes} cls={s.sgPals}>
        {t.paletteRows.map(([n, d, note], i) => (
          <div key={n} className={s.sgRow}>
            <span>{n}</span>
            <div className={s.sgPal}>
              <div className={s.sgChips}>{CHIPS[i].map((c) => <i key={c} style={{ background: c }} />)}</div>
              <div><p className={s.sgText}>{d}</p><p className={s.sgText} style={{ color: "var(--nl-dim)" }}>{note}</p></div>
            </div>
          </div>
        ))}
      </Section>
      <div style={{ height: 120 }} />
    </>
  );
}
