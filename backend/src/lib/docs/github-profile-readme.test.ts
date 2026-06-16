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
    let version: "72" | "60" | "59" = "59";
    if (
      source.includes("decision `#72`") ||
      source.includes("Decision `#72`") ||
      source.includes("decision `72`") ||
      source.includes("decision #72")
    ) {
      version = "72";
    } else if (
      source.includes("decision `#60`") ||
      source.includes("Decision `#60`") ||
      source.includes("decision `60`") ||
      source.includes("decision #60")
    ) {
      version = "60";
    }

    const versionClaims =
      version === "72"
        ? [
            "0xb52981a7282b5d48990c2d4bb69b313dbea74198f268b8a48b9cf72d56251481",
            "github-backend-f852e02-2026-06-15",
          ]
        : version === "60"
        ? [
            "0x42de71d7afe5e2500a1369b49525ae57b04f2c8ca7e7f358ddc052b63ba27677",
            "github-backend-42ba30a-2026-06-14",
          ]
        : [
            "0x67514654c1751b48506f3511ac42d463673520308612df8fc5e225cbf398ce77",
            "github-backend-45cdee4-2026-06-14",
          ];

    for (const claim of expectedBaseClaims) {
      assert.ok(source.includes(claim), `Expected ${filePath} to include base claim ${claim}`);
    }
    for (const claim of versionClaims) {
      assert.ok(source.includes(claim), `Expected ${filePath} to include version claim ${claim}`);
    }
  }
});
