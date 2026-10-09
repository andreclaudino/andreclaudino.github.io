# andreclaudino.github.io

Personal profile / portfolio page for **André Claudino** — AI/ML Engineer · MLOps ·
Generative AI.

- Live: <https://andreclaudino.com> · <https://andreclaudino.github.io>
- Static site: plain HTML + CSS + JS (no build step), served by GitHub Pages.
- Diagrams rendered client-side with [Mermaid](https://mermaid.js.org/).
- Design system inspired by the [typed-lm](https://neurono-ml.github.io/typed-lm/) skin:
  purple/blue gradients, Space Grotesk + Inter, animated stats, cards and scroll reveal,
  with light/dark themes.

## Structure

```
index.html        single, self-contained page (CSS and JS are inlined)
assets/favicon.svg  gradient "AC" mark
CNAME             custom domain (andreclaudino.com)
.nojekyll
```

CSS lives in a `<style>` block and the JS in a `<script>` block inside `index.html`,
so there are no separate asset files that can go stale or be blocked by a cache/proxy.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Editing

Content and styles live in `index.html`. To update facts (experience, skills, projects),
keep the career knowledge base in sync — it is the source of truth for public content.
The footer shows a `build` marker so you can confirm which version is deployed.
