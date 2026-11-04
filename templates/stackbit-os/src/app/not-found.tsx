import Link from "next/link";
import { site } from "@/components/sites/stackbitos/data";
import styles from "@/components/sites/stackbitos/stackbit.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <main className={styles.notFound}>
        <p className={styles.tag}>[ 404 ]</p>
        <h1>{site.notFound.title}</h1>
        <Link href="/" className={styles.outLink}>
          {site.notFound.home}
        </Link>
      </main>
    </div>
  );
}
