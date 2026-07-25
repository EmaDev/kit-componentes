import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // El repo tiene su propio package.json/lockfile un nivel arriba de dev/;
  // esto evita que Next infiera mal la raíz del workspace por eso.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
