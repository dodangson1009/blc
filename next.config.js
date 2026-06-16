/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      's2.coinmarketcap.com',
      's3.coinmarketcap.com',
      'cdn.sanity.io',
      'encrypted-tbn0.gstatic.com',
      'assets.coingecko.com',
      'coins.coingecko.com',
      'coin-images.coingecko.com',
    ],
  },
}

module.exports = nextConfig
