import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');

const base = readFileSync(`${distDir}/index.html`, 'utf-8');

const pages = [
  {
    output: 'ogq.html',
    title: '네이버 OGQ 이모티콘 미리보기 — 이모티콘뷰어',
    description: '네이버 OGQ 마켓 이모티콘을 실제 채팅창처럼 미리보기하세요. 제출 전 미리 확인할 수 있는 무료 시뮬레이터.',
    image: '/og-image-ogq.png',
  },
];

for (const page of pages) {
  let html = base
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${page.title}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${page.description}" />`)
    .replace(/<meta property="og:image"[^>]*>/g, `<meta property="og:image" content="${page.image}" />`)
    .replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${page.image}" />`)
    .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`);

  writeFileSync(`${distDir}/${page.output}`, html);
  console.log(`Generated: dist/${page.output}`);
}
