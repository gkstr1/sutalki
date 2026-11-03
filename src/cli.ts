// No arg-parsing library: five commands and three flags don't need one.

export type Style = "brooklyn" | "plain";

export type Source =
  | { type: "staged" }
  | { type: "diff"; branch: string }
  | { type: "range"; range: string };

export type Command =
  | { kind: "help" }
  | { kind: "version" }
  | { kind: "rewrite"; source: Source; check: boolean; style: Style; samples?: string }
  | { kind: "explain"; style: Style; samples?: string };

export class UsageError extends Error {}

export function parseArgs(argv: string[]): Command {
  const args = [...argv];
  let check = false;
  let style: Style = "brooklyn";
  let samples: string | undefined;

  // Pull flags out from anywhere in the args; what's left are the positional ones.
  const positional: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--check") {
      check = true;
    } else if (arg === "--style") {
      const value = args[++i];
      if (value !== "brooklyn" && value !== "plain") {
        throw new UsageError(`--style must be "brooklyn" or "plain", got ${JSON.stringify(value)}`);
      }
      style = value;
    } else if (arg === "--samples") {
      samples = args[++i];
      if (!samples) throw new UsageError("--samples needs a file path");
    } else if (arg === "--help" || arg === "-h") {
      return { kind: "help" };
    } else if (arg === "--version" || arg === "-v") {
      return { kind: "version" };
    } else {
      positional.push(arg);
    }
  }

  const [cmd, value] = positional;

  if (!cmd) return { kind: "rewrite", source: { type: "staged" }, check, style, samples };

  if (cmd === "explain") return { kind: "explain", style, samples };

  if (cmd === "diff") {
    if (!value) throw new UsageError("sutalki diff needs a branch name");
    return { kind: "rewrite", source: { type: "diff", branch: value }, check, style, samples };
  }

  if (cmd === "range") {
    if (!value || !value.includes("..")) throw new UsageError("sutalki range needs a commit range like abc123..def456");
    return { kind: "rewrite", source: { type: "range", range: value }, check, style, samples };
  }

  throw new UsageError(`unknown command "${cmd}"`);
}

export const HELP = `sutalki — finds AI-sounding comments in a git diff and rewrites them straight.

Usage:
  sutalki                  rewrite comments in staged changes (default)
  sutalki diff <branch>    rewrite comments in this branch compared with <branch>
  sutalki range <a..b>     rewrite comments in a range of commits
  sutalki explain          write a short Markdown explainer of the change
  sutalki --check          report AI-sounding comments and change nothing (for CI)

Options:
  --style brooklyn|plain   brooklyn is the default; plain tones it down
  --samples <file>         your own writing, so the voice matches yours
  --help, -h               show this help
  --version, -v            show the version`;

export async function main() {
  let command: Command;
  try {
    command = parseArgs(process.argv.slice(2));
  } catch (err) {
    if (err instanceof UsageError) {
      console.error(`sutalki: ${err.message}\n`);
      console.error(HELP);
      process.exitCode = 1;
      return;
    }
    throw err;
  }

  switch (command.kind) {
    case "help":
      console.log(HELP);
      return;
    case "version": {
      const { createRequire } = await import("node:module");
      const pkg = createRequire(import.meta.url)("../package.json");
      console.log(pkg.version);
      return;
    }
    case "rewrite":
      console.log("not implemented yet — step 2 reads the diff and finds the comments");
      console.log(command);
      return;
    case "explain":
      console.log("not implemented yet — step 2 reads the diff and finds the comments");
      console.log(command);
      return;
  }
}
