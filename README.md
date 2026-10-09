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
assets/vendor/mermaid.min.js    diagram renderer (local, no CDN)
assets/favicon.svg              gradient "AC" mark
CNAME                           custom domain (andreclaudino.com)
.nojekyll
```

The page CSS lives in a `<style>` block and the page JS in a `<script>` block inside
`index.html`, so there are no separate page assets that can go stale or be blocked.

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
