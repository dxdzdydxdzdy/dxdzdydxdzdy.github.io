import type { MetadataRoute } from 'next';
import { courses } from '@/content/courses';

const BASE = 'https://dxdzdydxdzdy.github.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/courses`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
  ];

  const coursePages: MetadataRoute.Sitemap = courses
    .filter(c => c.articles.length > 0)
    .map(c => ({
      url:             `${BASE}/courses/${c.slug}`,
      lastModified:    now,
      changeFrequency: 'weekly' as const,
      priority:        0.8,
    }));

  const articlePages: MetadataRoute.Sitemap = courses.flatMap(c =>
    c.articles.map(a => ({
      url:             `${BASE}/courses/${c.slug}/${a.slug}`,
      lastModified:    now,
      changeFrequency: 'monthly' as const,
      priority:        0.7,
    }))
  );

  return [...staticPages, ...coursePages, ...articlePages];
}
