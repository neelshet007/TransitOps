/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@transitops/types', '@transitops/utils'],
};

module.exports = nextConfig;
