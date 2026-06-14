import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(testDir, "../../..");
const githubReadmePath = path.resolve(backendRoot, "../.github/README.md");
const githubProfileReadmePath = path.resolve(
  backendRoot,
  "../.github/profile/README.md"
);

const expectedBaseClaims = [
  "0xe69755e4249c4978c39fbe847ca9674ce7af3505",
  "0x69984c20176704685236fd633192d7de1c13a5ec",
  "0x837a2948586de4e7638c742f99e520ffc049bcf7",
  "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
  "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
  "9109",
  "133",
  "0x2a2f94c40e2b5c080bd330f43f3ce6bc6b05e054b6626ce3ab2716220f0d3211",
  "default proof path prefers",
  "ERC-8004 campaign agent `9109`",
  "linked-proof",
  "human-verification flows",
];

test("GitHub profile docs stay aligned with the live Celo proof story", () => {
  for (const filePath of [githubReadmePath, githubProfileReadmePath]) {
    const source = readFileSync(filePath, "utf8");
    const isNew = source.includes("decision `#57`") || source.includes("Decision `#57`") || source.includes("decision `57`") || source.includes("decision #57");

    const versionClaims = isNew
      ? [
          "0x14264d9fa68c19e57b5664ef2330c3169ceb33eddad3e9d5640d9c4d8b99cdb9",
          "github-frontend-1f50d27-2026-06-14",
        ]
      : [
          "0x2a885db5be7aa9553e0db14693ddf7e17b6898b5cc16246a62ad05f38136cae3",
          "github-contracts-6a45563-2026-06-13",
        ];

    for (const claim of expectedBaseClaims) {
      assert.ok(source.includes(claim), `Expected ${filePath} to include base claim ${claim}`);
    }
    for (const claim of versionClaims) {
      assert.ok(source.includes(claim), `Expected ${filePath} to include version claim ${claim}`);
    }
  }
});
