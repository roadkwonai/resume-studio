import { ContactForm } from "./ContactForm";
import { headings, profile, site, splitLast } from "./data";
import { Heading } from "./Sections";
import s from "./sawad.module.css";

export function Contact() {
  const { contact, basics } = profile;
  const [a, b] = contact?.headline ? splitLast(contact.headline) : headings.contact;
  return (
    <section className={s.section}>
      <Heading a={a} b={b} />
      {contact?.note && <p className={s.heroText}>{contact.note}</p>}
      <ContactForm t={site.form} email={basics.email} budgets={contact?.budgets ?? []} />
    </section>
  );
}
