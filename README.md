# Cheryl Vo — Portfolio 2026

Interactive hotpot portfolio built with HTML, CSS, JavaScript, and Three.js. Includes project case studies, media, previous design versions, and preview captures.

## Run locally

From this repository folder:

```sh
python3 -m http.server 8123 --bind 127.0.0.1
```

Open http://127.0.0.1:8123/ in your browser. On Windows, use `py -m http.server 8123 --bind 127.0.0.1` if `python3` is unavailable.

No build step or package installation is required. Serve over HTTP rather than opening index.html directly, because the gallery loads ES modules and project JSON.

## Main files

- `index.html`: page and sidebar
- `hotpot.js`: 3D ingredients, selection, scroll animation, lighting, and pixel fire
- `hotpot.css`: gallery layout and background gradients
- `tactile-cards.css` / `tactile-cards.js`: sidebar folder styling and pointer interaction
- `projects.json`: project metadata
- `projects/`: case-study pages
- `media/`, `brands/`, `vendor/`: images, videos, company logos, and bundled Three.js

This repository stores the site source. Pushing changes does not automatically publish a live website.
