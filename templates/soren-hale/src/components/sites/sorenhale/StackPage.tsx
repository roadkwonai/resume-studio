"use client";

import { extras, fill, stackItems, ui } from "./data";
import { Chip, F_D, Sec, rv, useSec } from "./ui";

const levels = extras.stackLevels ?? [];
const groups = Array.from(new Set(stackItems.map((s) => s.group)));
const maxYears = Math.max(1, ...stackItems.map((s) => parseFloat(s.years) || 0));
const pad = (n: number) => String(n).padStart(2, "0");

function Inner() {
  const { on } = useSec();
  return (
    <div className="sh-wrap pg">
      {levels.length ? (
        <div className="shsp-legend" style={rv(on, 0)}>
          <p className="sh-lbl shsp-ll" id="shsp-l">{ui.stackPage.levels}</p>
          <dl aria-labelledby="shsp-l">
            {levels.map((v, i) => (
              <div key={v.level}>
                <dt><Chip t={v.level} tone={i === 0 ? "acc" : ""} /></dt>
                <dd>{v.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
      <div className="shsp-groups">
        {groups.map((g, gi) => {
          const items = stackItems.filter((s) => s.group === g);
          const notes = items.some((s) => s.note);
          return (
            <table className="shsp-t" role="table" key={g} style={rv(on, 120 + gi * 80, 16)}>
              <caption>
                <span className="shsp-cap">
                  <span className="shsp-gn sh-mono" aria-hidden="true">{pad(gi + 1)}</span>
                  <span className="shsp-gt" style={F_D}>{g}</span>
                  <span className="shsp-gc sh-mono">{items.length} {items.length === 1 ? ui.stackPage.one : ui.stackPage.many}</span>
                </span>
              </caption>
              <thead role="rowgroup">
                <tr role="row">
                  {[ui.stackPage.tool, ui.stackPage.years, ui.stackPage.level, ...(notes ? [ui.stackPage.note] : [])].map((h) => (
                    <th role="columnheader" scope="col" className="sh-lbl" key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody role="rowgroup">
                {items.map((s) => {
                  const y = parseFloat(s.years) || 0;
                  return (
                    <tr role="row" key={s.slug}>
                      <th role="rowheader" scope="row" className="shsp-name" style={F_D}>{s.name}</th>
                      <td role="cell" className="shsp-yr">
                        {s.years ? <span className="shsp-yv sh-mono">{fill(ui.stackPage.yr, { n: s.years })}</span> : null}
                        {y > 0 ? <i className="shsp-bar" aria-hidden="true"><i style={{ width: `${Math.round((y / maxYears) * 100)}%` }} /></i> : null}
                      </td>
                      <td role="cell" className="shsp-lv"><Chip t={s.frequency} tone={s.frequency === levels[0]?.level ? "acc" : ""} /></td>
                      {notes ? <td role="cell" className="shsp-line">{s.note}</td> : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        })}
      </div>
      {ui.stackPage.footnote ? <p className="shsp-note sh-lbl" style={rv(on, 300)}>{ui.stackPage.footnote}</p> : null}
    </div>
  );
}

export function StackPage() {
  return (
    <Sec className="shsp">
      <Inner />
    </Sec>
  );
}
