const constants = require("next/constants")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**'
      }
    ]
  }
}

module.exports = (phase, { defaultConfig }) => {
  let extras = {};

  if (process.env.ANALYZE && phase === constants.PHASE_DEVELOPMENT_SERVER) {
    const withNextBundleAnalyzer =
      require('next-bundle-analyzer')({ clientOnly: false });
    extras = withNextBundleAnalyzer(nextConfig);
  }

  return { ...defaultConfig, ...extras, ...nextConfig };
}
