export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/auth/'],
    },
    sitemap: 'https://amertaa.netlify.app/sitemap.xml',
  }
}
