import type { APIRoute } from 'astro';

// 網站配置（與 index.astro 保持一致）
const siteUrl = 'https://pv991.com';

// 動態頁面列表（可以根據需要擴展）
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/guide', priority: '0.9', changefreq: 'daily' }
];

// 動態生成 lastmod 日期（每次請求時都是當前日期）
const getLastMod = () => new Date().toISOString().split('T')[0];

// 渲染單個 URL 條目
const renderUrlEntry = (path: string, priority: string, changefreq: string) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${getLastMod()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

// 動態生成 sitemap
export const GET: APIRoute = () => {
  // 動態生成所有 URL 條目
  const urls = staticPages
    .map((page) => renderUrlEntry(page.path, page.priority, page.changefreq))
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
};

