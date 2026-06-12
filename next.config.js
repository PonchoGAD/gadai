/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // @solana/web3.js requires these Node.js built-in polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
};

module.exports = nextConfig;
