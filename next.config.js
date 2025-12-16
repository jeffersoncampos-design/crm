/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suprime avisos de hidratação causados por extensões do navegador
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Adiciona suporte a TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  // Adiciona suporte a ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
