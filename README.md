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
index.html              single-page profile
assets/css/style.css    design system (tokens, components, responsive, print)
assets/js/app.js        theme toggle, nav, scroll reveal, counters, Mermaid
assets/favicon.svg      gradient "AC" mark
CNAME                   custom domain (andreclaudino.com)
```

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Editing

Content lives directly in `index.html`. To update facts (experience, skills, projects),
keep the career knowledge base in sync — it is the source of truth for public content.
