// Validates a profile.json against the contract in profile.ts. Usage: node shared/validate.mjs <file>
import { readFileSync } from "node:fs";

export function validate(p) {
  const errors = [];
  const need = (obj, keys, at) => keys.forEach((k) => {
    const v = obj?.[k];
    if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) errors.push(`${at}.${k} is required`);
  });
  if (!["ko", "en"].includes(p.locale)) errors.push('locale must be "ko" or "en"');
  need(p.basics, ["name", "label", "headline", "summary", "about", "email"], "basics");
  const each = (list, keys, at) => (list ?? []).forEach((item, i) => need(item, keys, `${at}[${i}]`));
  each(p.work, ["company", "position", "start", "summary"], "work");
  each(p.education, ["institution", "area"], "education");
  each(p.skills, ["group", "items"], "skills");
  each(p.projects, ["slug", "name", "summary"], "projects");
  each(p.services, ["slug", "name", "summary"], "services");
  each(p.testimonials, ["quote", "name"], "testimonials");
  each(p.writing, ["slug", "title", "date", "summary", "body"], "writing");
  each(p.faq, ["question", "answer"], "faq");
  for (const key of ["projects", "services", "writing"]) {
    const slugs = (p[key] ?? []).map((x) => x.slug);
    if (new Set(slugs).size !== slugs.length) errors.push(`${key} has duplicate slugs`);
    slugs.filter((s) => s && !/^[a-z0-9-]+$/.test(s)).forEach((s) => errors.push(`${key} slug "${s}" must be lowercase a-z, 0-9, -`));
  }
  return errors;
}

if (process.argv[1]?.endsWith("validate.mjs")) {
  const errors = validate(JSON.parse(readFileSync(process.argv[2], "utf8")));
  errors.forEach((e) => console.error(`✗ ${e}`));
  console.log(errors.length ? `${errors.length} problem(s)` : "profile is valid");
  process.exit(errors.length ? 1 : 0);
}
