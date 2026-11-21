# Inspect a rendered interface

Use an available browser to check the main journey at desktop and mobile sizes. Record the route,
viewport, fixture and observed result. Include an adverse state and check focus during keyboard use.

If the project already has Playwright and its Chromium browser, capture the running local app.
Adapt the URL and use the same fixture for comparisons.

```sh
npx --no-install playwright screenshot --viewport-size="1280,800" http://127.0.0.1:3000 desktop.png
npx --no-install playwright screenshot --viewport-size="390,844" http://127.0.0.1:3000 mobile.png
```

Inspect the images and record actionable observations. Use browser interactions or tests for
states requiring actions. Report keyboard, screen reader and device checks separately.
