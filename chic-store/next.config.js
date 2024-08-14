module.exports = {
  images: {
    domains: ['media.giphy.com', 'storage.bunnycdn.com', 'chic-store-images.b-cdn.net'],

  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, dns: false, net: false, tls: false };
    return config;
  },
};