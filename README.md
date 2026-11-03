# Sutalki

You know the comment. `// This function is responsible for handling the user's request.` Thanks, I can read the function name. Every AI coding tool writes comments like a nervous intern trying to sound thorough, and they end up in your diff whether you wanted them or not.

Sutalki goes through your git diff, finds the comments and docstrings that read like that, and rewrites them the way an engineer would actually say it out loud — short, a little blunt, and it tells you *why* the code does something instead of narrating *what* it does. It never touches the code itself, and it shows you every change before anything gets written to disk.

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
sutalki                  # rewrite comments in what you've staged
sutalki diff main        # rewrite comments in this branch vs. main
sutalki range a..b       # rewrite comments across a range of commits
sutalki explain          # write a short, honest summary of what changed and why
sutalki --check          # just report what it found, change nothing — this is what CI runs
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

Same script. Same behavior. You can tell a person wrote the comments.

## Make it sound like you

`--style plain` dials the attitude down if Brooklyn isn't the right voice for a given repo. `--samples your-writing.txt` points it at something you've actually written so the rewrites lean toward your own voice instead of the default one.

## How it decides what to touch

It reads the diff with `git`, not with a model — no guessing what changed. A real parser (tree-sitter) picks out exactly the comments, docstrings, and Markdown prose the diff added or changed; code is never in scope. Each piece goes to whichever model you've got configured — Anthropic, OpenAI, or a local Ollama model — for a rewrite. After you approve changes, Sutalki strips comments from the file before and after and checks the code underneath is byte-for-byte identical. If it isn't, nothing gets applied and it tells you why.

## Where this stands right now

The command-line part works — all five commands, the flags, help, version, error messages. The part that actually reads a diff, finds comments, and rewrites them hasn't been built yet, so right now running `sutalki` tells you what it *would* do instead of doing it. That's next.

Also coming: a pre-commit hook, a GitHub Action that checks pull requests, and a Claude Code skill — all thin wrappers around the same core, once the core exists.

## License

MIT — see [LICENSE](LICENSE).
