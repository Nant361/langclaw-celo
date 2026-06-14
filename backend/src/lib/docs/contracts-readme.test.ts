import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(testDir, "../../..");
const contractsReadmePath = path.resolve(backendRoot, "../contracts/README.md");

const expectedBaseClaims = [
  "0xe69755e4249c4978c39fbe847ca9674ce7af3505",
  "0x69984c20176704685236fd633192d7de1c13a5ec",
  "0x837a2948586de4e7638c742f99e520ffc049bcf7",
  "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
  "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
  "0x2cA915EF6be8D2D48ccD3c5dAF715546AF873A4c",
  "9109",
  "133",
  "0x1b7cb74378db42551a3cbc81dcd560f337df1593d4ef1cd70ee44ff269bdc7f3",
  "0x3c7d0cc69f77d2aef5ab21bfe703d0f33f7037d5e2162209d78b23b5c3f1cde6",
  "0x2a2f94c40e2b5c080bd330f43f3ce6bc6b05e054b6626ce3ab2716220f0d3211",
  "smart-money",
  "ready: true` with status `ready",
  "primary campaign proof writer",
  "Campaign verification should prove the token-backed path",
  "frontend `/usage` flow approves USDT",
  "POST /api/usage/deposit/verify",
  "confirmed vault deposit event",
  "git remote get-url origin",
];

test("contracts README stays aligned with live public Celo proof references", () => {
  const source = readFileSync(contractsReadmePath, "utf8");
  const isNew = source.includes("decision `#57`") || source.includes("Decision `#57`") || source.includes("decision `57`") || source.includes("decision #57") || source.includes("decision `57`") || source.includes("decision `57`") || source.includes("Registry decision `57`");

  const versionClaims = isNew
    ? [
        "0x14264d9fa68c19e57b5664ef2330c3169ceb33eddad3e9d5640d9c4d8b99cdb9",
        "campaign-backend-proof",
        "github-frontend-1f50d27-2026-06-14",
        "https://github.com/Nant361/langclaw-celo/commit/1f50d27547e14fd730096dcb1eedce88938e6341",
      ]
    : [
        "0x2a885db5be7aa9553e0db14693ddf7e17b6898b5cc16246a62ad05f38136cae3",
        "campaign-contracts-proof",
        "github-contracts-6a45563-2026-06-13",
        "https://github.com/Nant361/langclaw-celo/commit/6a455639853fd0d5d1492af2fb076169a4057ce1",
      ];

  for (const claim of expectedBaseClaims) {
    assert.ok(
      source.includes(claim),
      `Expected contracts README to include base claim ${claim}`
    );
  }

  for (const claim of versionClaims) {
    assert.ok(
      source.includes(claim),
      `Expected contracts README to include version claim ${claim}`
    );
  }
});
