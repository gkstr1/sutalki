# Sutalki

Sutalki reads your `git diff` and explains it back to you — the comments, the docstrings, the summary of what changed — in a real voice instead of the flat, hedgy language most tools default to. Brooklyn by default: short, blunt, a little wry, tells you *why* instead of narrating *what*. Tell it to tone down and it will.

Free. Open source. Anyone can run it.

```
// before
// This function is responsible for validating the user's email address
// before it is passed to the downstream service for processing.
function checkEmail(input) { ... }

// after
// Catches garbage before it hits the API — saves us a round trip.
function checkEmail(input) { ... }
```

## Install

Not on npm yet. For now, run it from source:

```bash
git clone https://github.com/gkstr1/sutalki.git
cd sutalki
npm install
npm run build
npm link
```

That puts a `sutalki` command on your path.

## Use it

```bash
sutalki                  # rewrite the comments in what you've staged
sutalki diff main        # rewrite the comments in this branch vs. main
sutalki range a..b       # rewrite the comments across a range of commits
sutalki explain          # write a short, plain explainer of what changed and why
sutalki --check          # show what it would rewrite, change nothing — this is what CI runs
```

Nothing gets written until you say yes. It shows you the original next to the rewrite, and you accept, edit, or skip each one.

### A real one

Say your deploy script looks like this:

```bash
# This script is responsible for deploying the application to production.
# It is important to ensure that all tests pass before proceeding with deployment.
npm test

# Deploy the application using Wrangler, which is the official Cloudflare CLI tool.
npx wrangler deploy

# It should be noted that the deployment may take a few minutes to propagate.
echo "Deployed. Note: propagation can take a few minutes."
```

Sutalki turns it into this:

```bash
# Don't skip this. A green deploy with failing tests is worse than no deploy.
npm test

# Wrangler ships it to Cloudflare.
npx wrangler deploy

# Give it a minute before you trust the URL.
echo "Deployed. Note: propagation can take a few minutes."
```

Same script, same behavior — you can tell a person wrote it.

## Make it sound like you

`--style plain` dials the attitude down if Brooklyn isn't the right voice for a given repo. `--samples your-writing.txt` points it at something you've actually written so it leans toward your own voice instead of the default one.

## How it works

It reads the diff with `git` itself, not with a model — no guessing what changed. A real parser (tree-sitter) picks out exactly the comments, docstrings, and Markdown prose the diff touched; code is never in scope. Each piece goes to whichever model you've got configured — Anthropic, OpenAI, or a local Ollama model — to be rewritten in plain human language. After you approve the changes, Sutalki strips comments from the file before and after and checks the code underneath is byte-for-byte identical. If it isn't, nothing gets applied and it tells you why.

## Where this stands right now

The command-line part works — all five commands, the flags, help, version, error messages. The part that actually reads a diff and rewrites it hasn't been built yet, so right now running `sutalki` tells you what it *would* do instead of doing it. That's next.

Also coming: a pre-commit hook, a GitHub Action that checks pull requests, and a Claude Code skill — all thin wrappers around the same core, once the core exists.

## License

MIT — see [LICENSE](LICENSE).
