// One command for the whole gallery: builds what is missing, then serves the five templates and the gallery on localhost.
// Usage: npm run studio [-- --rebuild]
import { execFileSync, spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const rebuild = process.argv.includes("--rebuild");
const apps = [
  ...readdirSync(join(root, "templates")).map((id) => {
    const dir = join(root, "templates", id);
    return { dir, name: id, port: JSON.parse(readFileSync(join(dir, "template.json"), "utf8")).port };
  }),
  { dir: join(root, "gallery"), name: "gallery", port: 4100 },
];

for (const app of apps) {
  if (rebuild || !existsSync(join(app.dir, ".next/BUILD_ID"))) {
    console.log(`building ${app.name}…`);
    execFileSync("npx", ["next", "build"], { cwd: app.dir, stdio: ["ignore", "ignore", "inherit"] });
  }
}

const children = apps.map((app) =>
  spawn("npx", ["next", "start", "-p", String(app.port), "-H", "127.0.0.1"], { cwd: app.dir, stdio: ["ignore", "ignore", "inherit"] }),
);
const stop = () => {
  children.forEach((child) => child.kill());
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
console.log("gallery: http://localhost:4100  (Ctrl+C to stop)");
