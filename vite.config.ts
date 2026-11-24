import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { buildJsonLd, buildLlmsTxt, buildStaticHtml, buildSitemap } from './seo/generate';

// Lagar strukturerte data, llms.txt og sitemap frå programmet (data/events.ts)
// kvar gong sida blir bygd. Sjå seo/generate.ts.
function seoPlugin(): Plugin {
  const now = new Date();
  return {
    name: 'stoyperiet-seo',
    transformIndexHtml(html) {
      const json = JSON.stringify(buildJsonLd(now), null, 2).replace(/</g, '\\u003c');
      return html
        .replace('<!--SEO_JSONLD-->', `<script type="application/ld+json">\n${json}\n    </script>`)
        .replace('<!--SEO_STATIC-->', buildStaticHtml(now));
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: buildLlmsTxt(now) });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(now) });
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), seoPlugin()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
