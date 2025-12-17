import { createSecureHeaders } from './src/lib/security-headers.js';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  headers: async () => [{
    source: '/:path*',
    headers: createSecureHeaders()
  }]
};

export default nextConfig;
