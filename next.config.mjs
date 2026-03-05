import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true,
    domains: ["c.animaapp.com", "rewardsapi.hireagent.co"],
  },
};

export default nextConfig;
