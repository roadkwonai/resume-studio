import { ProfileCard } from "@/components/sites/sawad/Chrome";
import s from "@/components/sites/sawad/sawad.module.css";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={s.wrap}>
      <aside className={s.left}>
        <ProfileCard />
      </aside>
      <main className={s.right}>{children}</main>
    </div>
  );
}
