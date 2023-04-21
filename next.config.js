const constants = require("next/constants")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
}

module.exports = (phase, { defaultConfig }) => {
  let extras = {};

  if (process.env.ANALYZE && phase === constants.PHASE_DEVELOPMENT_SERVER) {
    const withNextBundleAnalyzer =
      require('next-bundle-analyzer')({ clientOnly: false });
    extras = withNextBundleAnalyzer(nextConfig);
  }

  return { ...nextConfig, ...defaultConfig, ...extras };
}
