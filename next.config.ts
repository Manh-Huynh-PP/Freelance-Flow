
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push('handlebars', '@opentelemetry/exporter-jaeger');
    return config;
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    const vercelAnalytics = 'https://va.vercel-scripts.com';
    const vercelLive = 'https://vercel.live';
    const cspValue = isDev
      ? `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.cloudflareinsights.com ${vercelAnalytics} ${vercelLive}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https: http:; media-src 'self' data: blob: https: http:; connect-src 'self' ws: wss: https://generativelanguage.googleapis.com ${vercelAnalytics} ${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}; frame-ancestors 'none'; base-uri 'self'`
      : `default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://static.cloudflareinsights.com ${vercelAnalytics} ${vercelLive}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; media-src 'self' data: blob: https: http:; connect-src 'self' wss: data: blob: https://generativelanguage.googleapis.com ${vercelAnalytics} ${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}; frame-ancestors 'none'; base-uri 'self'`;

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Only add HSTS in production with HTTPS
          ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }]),
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: cspValue
          },
        ],
      },
    ];
  },
};

export default nextConfig;
