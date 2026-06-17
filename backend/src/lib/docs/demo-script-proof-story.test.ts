import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(testDir, "../../..");
const demoScriptPath = path.join(backendRoot, "docs", "DEMO_SCRIPT.md");

const expectedClaims = [
  "Agent Decision Proof panel.",
  "Proof Center at `/proofs`.",
  "current campaign proof uses ERC-8004 agent ID 9109",
  "`agentId = 9109`.",
  "Latest campaign decision `#72`.",
  "0xb52981a7282b5d48990c2d4bb69b313dbea74198f268b8a48b9cf72d56251481",
  "Self-linked decision `#1`.",
  "Self Agent ID `133`.",
  "ERC-8004 agent ID `9109`.",
  "0x2a2f94c40e2b5c080bd330f43f3ce6bc6b05e054b6626ce3ab2716220f0d3211",
  "npm run check:celo-proof",
  "npm run check:eligibility",
  "pnpm typecheck",
  "pnpm build",
  "forge build",
  "forge test",
];

test("demo script keeps the shipped proof story and verification checklist", () => {
  const source = readFileSync(demoScriptPath, "utf8");

  for (const claim of expectedClaims) {
    if (claim === "Latest campaign decision `#72`.") {
      assert.ok(
        source.includes("Latest campaign decision `#72`.") ||
        source.includes("Latest campaign decision `#73`."),
        "Expected DEMO_SCRIPT.md to include campaign decision reference."
      );
      continue;
    }
    if (claim === "0xb52981a7282b5d48990c2d4bb69b313dbea74198f268b8a48b9cf72d56251481") {
      assert.ok(
        source.includes("0xb52981a7282b5d48990c2d4bb69b313dbea74198f268b8a48b9cf72d56251481") ||
        source.includes("0x11523c3a03d04332ea195ebfdeab4e2c2966fcf3a0816e5fabf62f94695edbe8"),
        "Expected DEMO_SCRIPT.md to include campaign decision tx hash."
      );
      continue;
    }

    assert.ok(
      source.includes(claim),
      `Expected DEMO_SCRIPT.md to include ${claim}`
    );
  }
});
