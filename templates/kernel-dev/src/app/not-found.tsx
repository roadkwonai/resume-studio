import Link from "next/link";
import { site } from "@/components/sites/kerneldev/data";
import s from "@/components/sites/kerneldev/kerneldev.module.css";

export default function NotFound() {
  return (
    <div className={s.root}>
      <div className={s.page}>
        <main className={s.section}>
          <h1 className={s.h2}>{site.notFound.title}</h1>
          <Link className={s.link} href="/">
            {site.notFound.home}
          </Link>
        </main>
      </div>
    </div>
  );
}
