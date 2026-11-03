import { test } from "node:test";
import assert from "node:assert/strict";
import { parseArgs, UsageError } from "../src/cli.ts";

test("no args means rewrite staged changes, brooklyn style, not check-only", () => {
  assert.deepEqual(parseArgs([]), {
    kind: "rewrite",
    source: { type: "staged" },
    check: false,
    style: "brooklyn",
    samples: undefined,
  });
});

test("diff <branch>", () => {
  const cmd = parseArgs(["diff", "main"]);
  assert.deepEqual(cmd, {
    kind: "rewrite",
    source: { type: "diff", branch: "main" },
    check: false,
    style: "brooklyn",
    samples: undefined,
  });
});

test("diff without a branch is a usage error", () => {
  assert.throws(() => parseArgs(["diff"]), UsageError);
});

test("range a..b", () => {
  const cmd = parseArgs(["range", "abc123..def456"]);
  assert.deepEqual(cmd, {
    kind: "rewrite",
    source: { type: "range", range: "abc123..def456" },
    check: false,
    style: "brooklyn",
    samples: undefined,
  });
});

test("range without .. is a usage error", () => {
  assert.throws(() => parseArgs(["range", "notarange"]), UsageError);
});

test("explain", () => {
  assert.deepEqual(parseArgs(["explain"]), { kind: "explain", style: "brooklyn", samples: undefined });
});

test("--check, --style and --samples work in any position", () => {
  const cmd = parseArgs(["diff", "main", "--check", "--style", "plain", "--samples", "voice.txt"]);
  assert.deepEqual(cmd, {
    kind: "rewrite",
    source: { type: "diff", branch: "main" },
    check: true,
    style: "plain",
    samples: "voice.txt",
  });
});

test("bad --style value is a usage error", () => {
  assert.throws(() => parseArgs(["--style", "sarcastic"]), UsageError);
});

test("--help short-circuits everything else", () => {
  assert.deepEqual(parseArgs(["diff", "main", "--help"]), { kind: "help" });
});

test("unknown command is a usage error", () => {
  assert.throws(() => parseArgs(["rewrite-everything"]), UsageError);
});
