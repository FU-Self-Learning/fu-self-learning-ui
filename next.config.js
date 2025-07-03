const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  sassOptions: {
    includePaths: [path.resolve(__dirname, './src/styles')],
  },
};

module.exports = nextConfig;
