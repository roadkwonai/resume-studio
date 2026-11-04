import Link from "next/link";
import { site } from "@/components/sites/fastfolio/data";

export default function NotFound() {
  return (
    <main className="ff-missing">
      <h1>{site.notFound.title}</h1>
      <Link className="ff-btn ff-btn-solid" href="/">
        {site.notFound.home}
      </Link>
    </main>
  );
}
