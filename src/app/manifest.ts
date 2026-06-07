import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'dxlearn',
    short_name: 'dxlearn',
    description: 'Интерактивные курсы по веб-разработке',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0a0f0f',
    theme_color: '#0a0f0f',
    icons: [
      { src: '/favicon-16x16.png',   sizes: '16x16',  type: 'image/png' },
      { src: '/favicon-32x32.png',   sizes: '32x32',  type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
    ],
    categories: ['education', 'productivity'],
  };
}
