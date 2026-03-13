const zohoDomains = [
  "https://analyticsapi.zoho.com",
  "https://analytics.zoho.com",
  "https://reportsapi.zoho.com",
  "https://reports.zoho.com"
];

export function createSecureHeaders() {
  const csp = [
    "default-src 'self'",
    "frame-src 'self' " + zohoDomains.join(' '),
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'"
  ].join('; ');

  return [
    { key: 'Content-Security-Policy', value: csp },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'no-referrer' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' }
  ];
}
