module.exports = {
  images: {
    domains: ['media.giphy.com', 'storage.bunnycdn.com', 'chic-store-images.b-cdn.net'],
  },
  env: {
    API_URL: 'http://89.33.44.28:3000',
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, dns: false, net: false, tls: false };
    return config;
  },
};