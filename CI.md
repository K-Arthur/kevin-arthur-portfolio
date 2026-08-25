# CI / CD

This project uses three GitHub Actions workflows. They are intentionally split so
that a noisy performance audit can never hide a real build/lint/type failure, and
vice-versa.

| Workflow | File | Purpose | Required check? |
|----------|------|---------|----------------|
| **CI** | `.github/workflows/ci.yml` | Lint + type-check + production build | Recommended (the trustworthy gate) |
| **Lighthouse CI** | `.github/workflows/lighthouse.yml` | Performance / a11y / SEO quality audit | Informational / quality signal |
| **Revalidate Media Metadata** | `.github/workflows/revalidate-media.yml` | Manual on-demand cache revalidation on the deployed site | Manual only |

Branch protection is **not** currently enabled. If you enable it, make
`Lint, Type-check & Build` (the `CI` workflow) a required status check, not the
Lighthouse workflow (Lighthouse scores are inherently environment-sensitive).

## What each workflow does

### CI (`ci.yml`)
Runs on every push/PR to `main`/`master`. It performs, in order:

1. `npm ci` — reproducible install from the lockfile.
2. `npm run lint` — ESLint (warnings allowed, errors block).
3. `npm run typecheck` (`tsc --noEmit`) — TypeScript type safety.
4. `npm run build` — Next.js production build (also runs the `prebuild` PDF step).

This is the canonical "did my change break the build?" signal.

### Lighthouse CI (`lighthouse.yml`)
Builds the site, starts the production server, and runs Lighthouse 3× against
`/` and `/case-studies`, then enforces a **curated** assertion set (see
`lighthouserc.js`). Results are:

- written to the job **summary** (via `scripts/lhci-summary.js`),
- uploaded as a `lighthouse-reports` artifact, and
- posted as a PR comment (same-repo PRs only).

### Revalidate Media Metadata (`revalidate-media.yml`)
Manually triggered (`workflow_dispatch`). Calls the deployed site's
`/api/revalidate-media` endpoint. Secrets are passed via environment variables
(never interpolated into the shell) and the HTTP status is checked.

## Local parity (CachyOS / Arch Linux)

The CI Node version is pinned in `.nvmrc` (currently `22`). Use the same major
locally to avoid "works on my machine" drift:

```bash
# Install the pinned Node via nvm / fnm / your version manager
nvm install && nvm use        # reads .nvmrc

# Run the exact checks CI runs:
npm ci
npm run ci:local              # lint + typecheck + build

# Run the Lighthouse audit locally (requires Chrome/Chromium):
npm ci
npm run build
npx lhci autorun              # needs a Chromium binary on PATH
```

To install Chromium on Arch/CachyOS for local Lighthouse runs:

```bash
sudo pacman -S chromium       # provides /usr/bin/chromium for lhci
```

> Note: Lighthouse scores in CI run against the localhost dev server image, so
> absolute numbers differ from production (CDN, preconnect, caching). Treat the
> Lighthouse workflow as a regression signal, not an absolute grade.

## Validating workflow changes locally

```bash
# Parse/validate the YAML (no Docker needed):
python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]; print('ok')"

# List workflows as act sees them (requires Docker):
act --list
```

We intentionally do **not** require a heavy local Actions runner. The
`ci.yml` checks are plain npm scripts you can run with `npm run ci:local`.

## Debugging a failing run

```bash
# List recent runs
gh run list

# Inspect a specific run (or the latest failing one)
gh run view
gh run view --log-failed

# Download the Lighthouse artifact to inspect raw JSON/HTML:
gh run download <run-id> -n lighthouse-reports
```

When the **Lighthouse** job fails, open the job summary first: it lists every
failing assertion with expected vs. found values and a message. For deeper
analysis, download the `lighthouse-reports` artifact and open the `.report.json`
or `.html` in your browser.

## Secrets (names and purpose only — never values)

| Secret | Used by | Purpose |
|--------|---------|---------|
| `VERCEL_DOMAIN` | revalidate-media.yml | Base URL of the deployed site for the revalidate call |
| `REVALIDATE_TOKEN` | revalidate-media.yml | Bearer token accepted by `/api/revalidate-media` |
| `LHCI_GITHUB_APP_TOKEN` | (legacy) | Previously used for an LHCI GitHub status target; **unused** since the upload target is `temporary-public-storage` |

No secret is required for the `CI` or `Lighthouse CI` workflows to run on forks;
they only need public, non-secret CI.

## Common failures & fixes

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `CI` job fails at `npm ci` | Lockfile out of sync with `package.json` | Run `npm install` locally, commit the updated `package-lock.json` |
| Lighthouse `heading-order` error | A page jumps heading levels (e.g. `<h1>` → `<h3>`) | Fix the heading hierarchy in the component |
| Lighthouse `offscreen-images` / `uses-rel-preconnect` warnings | Environment-only opportunities in CI | Expected; reported, not gating (see `lighthouserc.js`) |
| Revalidate job fails with `::error::Required secrets ...` | Secrets not configured | Add `VERCEL_DOMAIN` / `REVALIDATE_TOKEN` in repo settings |
| Revalidate job `HTTP 401` | Wrong/missing token | Verify `REVALIDATE_TOKEN` matches the deployed app |

## History / root-cause note

The Lighthouse workflow previously failed on **every** run for ~6 months. The
root cause was using the `lighthouse:no-pwa` preset, which marks essentially
every Lighthouse audit as an `error`-level assertion — so the pipeline failed
continuously and provided zero signal. See `GITHUB_PIPELINE_MEMORY.md` for the
full failure ledger and the rationale behind the curated assertion set now in
`lighthouserc.js`.
