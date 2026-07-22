# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

BangDD is a browser WebExtension (Manifest V3, Chrome + Firefox) that adds a "Google" button to the DuckDuckGo search results page. Clicking it appends the `!g` bang to the current search box and resubmits the search, redirecting to Google.

The entire extension logic lives in a single content script: `bangdd.js`. There is no build step, bundler, or package manager — this is plain, dependency-free JavaScript injected directly into `duckduckgo.com` pages per `manifest.json`'s `content_scripts` entry.

## Commands

- `make lint` — lints via `web-ext lint` (requires `web-ext`, install with `make install_deps`)
- `make install_deps` — installs `web-ext` globally via npm
- `make package` — zips `*.js`, `*.json`, `*.md`, and `icons/` into `BangDD-v<version>.zip` for store submission (bump the version in `manifest.json` and the Makefile's zip target together)

There is no test suite and no build/compile step. There is no `package.json` in this repo — `web-ext` is expected to be installed globally.

## Architecture

- `manifest.json` — MV3 manifest. Declares the content script match pattern (`*://*.duckduckgo.com/*`) and Firefox-specific settings (`browser_specific_settings.gecko`, including `data_collection_permissions`).
- `bangdd.js` — the whole extension:
  - `CONFIG` holds the DOM ids/selectors it depends on: the DuckDuckGo search input id (`search_form_input`) and the duckbar container selector (`#react-duckbar ul`), plus the bang to inject (`!g`).
  - `onExtensionLoading()` is the entry point: it's wired to `DOMContentLoaded`, called immediately on script load, and retried via `setTimeout` at 1s and 5s — this redundancy exists because DuckDuckGo's search UI (`#react-duckbar`) is rendered client-side/asynchronously by React, so the target DOM nodes may not exist yet at any single one of these points.
  - `createButton()` clones styling from an existing duckbar `<li>`/`<a>` (picking the second-to-last item, falling back to the last) so the injected button visually matches DuckDuckGo's current theme/markup instead of hardcoding classes.
  - `insertInCorrectPosition()` removes any previously-inserted `#bang_it` button before re-inserting, since `onExtensionLoading` can run multiple times.
  - `onTimeToBang()` is the click handler: appends `!g` to the search input if not already present, then submits — preferring the form's real submit button, falling back to `form.requestSubmit()`, then `form.submit()`.
  - All DOM lookups (`getSearchForm`, `getSubmitButton`, `document.getElementById(CONFIG.ID_SEARCH_FORM)`, etc.) are guarded for null, since DuckDuckGo's markup/ids are external and can change or be absent — do not remove these guards when editing.

Because this script's entire correctness depends on DuckDuckGo's live DOM structure and ids (`search_form_input`, `#react-duckbar`), verifying a change means loading the extension unpacked in a browser and testing against the real duckduckgo.com page, not just reading the code.

## Linting

ESLint config (`.eslintrc.json`) targets ES2017 in a `browser`/`webextensions` environment, extending `eslint:recommended`. `no-console` is off (console logging is fine); `no-unused-vars` and `no-undef` are warnings, not errors; `no-proto` is an error.
