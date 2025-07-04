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

    // ✅ Thêm alias @
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['@p'] = path.resolve(__dirname, 'public');

    return config;
  },

  sassOptions: {
    includePaths: [path.resolve(__dirname, './src/styles')],
  },
};

module.exports = nextConfig;
