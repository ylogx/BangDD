# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

BangDD is a browser WebExtension (Manifest V3, Chrome + Firefox, including Firefox for Android) that adds a "Google" button to the DuckDuckGo search results page. Clicking it appends the `!g` bang to the current search box and resubmits the search, redirecting to Google.

The extension logic lives in `src/bangdd.ts`, compiled by `tsc` (no bundler — single file, no imports/exports) to `dist/bangdd.js`, which is what `manifest.json`'s `content_scripts` entry actually loads. `dist/` is gitignored and build output, not source.

## Commands

- `npm install` (or `make install_deps`) — installs dependencies, including `web-ext` globally
- `make build` / `npm run build` — compiles `src/bangdd.ts` to `dist/bangdd.js` via `tsc`
- `npm run watch` — `tsc --watch` for iterating
- `make lint` — runs `tsc --noEmit`, `eslint .`, then `web-ext lint`
- `make package` — builds, then zips `dist/`, `manifest.json`, `*.md`, and `icons/` into `BangDD-v<version>.zip` for store submission (bump the version in `manifest.json`, `package.json`, and the Makefile's zip target together)

There is no test suite. To load the extension unpacked for manual testing, run `make build` first — `dist/bangdd.js` must exist.

## Architecture

- `manifest.json` — MV3 manifest. Declares the content script match pattern (`*://*.duckduckgo.com/*`, pointing at `dist/bangdd.js`) and Firefox-specific settings (`browser_specific_settings.gecko`, including the `id` GUID that must be preserved to keep AMO auto-updates working, and `data_collection_permissions`).
- `src/bangdd.ts` — the whole extension, in strict-mode TypeScript (`tsconfig.json`: `strict`, `noUncheckedIndexedAccess`):
  - `CONFIG` holds the DOM ids/selectors it depends on: the DuckDuckGo search input id (`search_form_input`) and the duckbar container selector (`#react-duckbar ul`), plus the bang to inject (`!g`).
  - `onExtensionLoading()` is the entry point, wired to `DOMContentLoaded` and called immediately on script load. A `MutationObserver` on `document.documentElement` (coalesced to once per animation frame via `scheduleEnsureButton`) re-runs it whenever the DOM changes — this replaces older `setTimeout`-based polling and also handles DuckDuckGo re-rendering the duckbar client-side after the button was already inserted.
  - `createButton()` clones styling from an existing duckbar `<li>`/`<a>` (picking the second-to-last item, falling back to the last) so the injected button visually matches DuckDuckGo's current theme/markup instead of hardcoding classes. Built via `createElement`/`className`/`textContent`, not `innerHTML` (avoids the "unsafe assignment to innerHTML" warning from Firefox's addon linter).
  - `insertInCorrectPosition()` removes any previously-inserted `#bang_it` button before re-inserting, since `onExtensionLoading` can run multiple times.
  - `onTimeToBang()` is the click handler: appends `!g` to the search input if not already present, then submits — preferring the form's real submit button, falling back to `form.requestSubmit()`, then `form.submit()`.
  - All DOM lookups (`getSearchForm`, `getSubmitButton`, `document.getElementById(CONFIG.ID_SEARCH_FORM)`, etc.) are guarded for null, since DuckDuckGo's markup/ids are external and can change or be absent — do not remove these guards when editing. TypeScript's `strict` mode will refuse to compile if a new lookup isn't guarded, which is the main payoff of the TS conversion (this has bitten the project twice before: `search_button` id disappearing, and a DDG bang-redirect page where `search_form_input` doesn't exist).

Because this script's entire correctness depends on DuckDuckGo's live DOM structure and ids (`search_form_input`, `#react-duckbar`), verifying a change means building (`make build`) and loading the extension unpacked in a browser, testing against the real duckduckgo.com page — not just reading the code or relying on `tsc`/`eslint` passing.

## Linting

`eslint.config.mjs` (flat config) applies `@eslint/js` recommended rules plus `typescript-eslint`'s recommended rules, with `no-console` off. `tsconfig.json`'s `strict` mode is the primary type-safety net; `web-ext lint` catches store-submission-specific issues (manifest schema, Firefox data-collection-permissions requirement, unsafe `innerHTML`, etc.) that ESLint doesn't know about.
