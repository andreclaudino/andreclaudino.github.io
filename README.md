# andreclaudino.github.io

Personal profile / portfolio page for **André Claudino** — AI/ML Engineer · MLOps ·
Generative AI.

- Live: <https://andreclaudino.com> · <https://andreclaudino.github.io>
- Static site: plain HTML + CSS + JS (no build step), served by GitHub Pages.
- Diagrams rendered client-side with [Mermaid](https://mermaid.js.org/), **hosted locally**
  (`assets/vendor/mermaid.min.js`, no CDN). Mermaid measures label widths in the visitor's
  browser, so node boxes always fit the actual font.
- Design system inspired by the [typed-lm](https://neurono-ml.github.io/typed-lm/) skin:
  purple/blue gradients, Space Grotesk + Inter, animated stats, cards and scroll reveal,
  with light/dark themes.

## Structure

```
index.html                      page: markup + inlined <style> and <script>
privacy.html                    privacy & cookie policy (consent reset)
404.html                        custom not-found page
robots.txt                      crawl rules + sitemap pointer
sitemap.xml                     sitemap (index + privacy)
site.webmanifest                PWA manifest (name, icons, theme)
google*.html                    Google Search Console verification file
assets/site.css                 shared chrome for privacy.html / 404.html
assets/vendor/mermaid.min.js    diagram renderer (local, no CDN)
assets/favicon.svg              gradient "AC" mark
assets/og-image.png             1200x630 social card (Open Graph / Twitter)
assets/icon-*.png               app icons
scripts/make-social-assets.py   regenerates og-image.png and the icons
CNAME                           custom domain (andreclaudino.com)
.nojekyll
```

The page CSS lives in a `<style>` block and the page JS in a `<script>` block inside
`index.html`, so there are no separate page assets that can go stale or be blocked.

## Analytics & privacy

- **Google Analytics 4**, property `andreclaudino.com`, measurement ID `G-N0STBT71P9`.
  The ID is set once in `index.html` (`window.GA4_ID`) — change it there and in the
  `<noscript>` fallback image if the property ever moves.
- **Consent Mode v2**: every consent type defaults to `denied`; `gtag.js` is only injected
  after the visitor presses *Accept*, and the choice is stored in `localStorage`
  (`ac-consent`). Visitors can reset it on `privacy.html`.
- Custom events: `article_click`, `click_outbound`, `contact_click`, `consent_choice`.
- Nothing is collected for advertising and IPs are anonymised.

## SEO

- Canonical URL, `hreflang`, robots directives, Open Graph + Twitter large card, JSON-LD
  `@graph` (Person, WebSite, ProfilePage, ItemList of articles).
- `robots.txt` + `sitemap.xml`; submitted to Google Search Console
  (verification: `google-site-verification` meta tag and `google29e18863a8e69344.html`).
- Regenerate social assets with `python3 scripts/make-social-assets.py` after changing the
  headline or brand colours.


## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Editing

Content and styles live in `index.html`. Diagrams are Mermaid sources in `<pre class="mermaid">`
blocks. To update facts (experience, skills, projects), keep the career knowledge base in sync —
it is the source of truth for public content. The footer shows a `build` marker so you can
confirm which version is deployed.
