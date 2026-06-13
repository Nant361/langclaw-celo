import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(testDir, "../../..");
const readmePath = path.join(backendRoot, "README.md");
const eligibilityPath = path.join(backendRoot, "docs", "CELO_ELIGIBILITY.md");
const hackathonSubmissionPath = path.join(
  backendRoot,
  "docs",
  "HACKATHON_SUBMISSION.md"
);
const smartContractNotesPath = path.join(
  backendRoot,
  "docs",
  "SMART_CONTRACT_TEAM_NOTES.md"
);
const campaignProgressJune13Path = path.join(
  backendRoot,
  "docs",
  "CAMPAIGN_PROGRESS_2026-06-13.md"
);

const sourceFiles = [
  { label: "README", path: readmePath },
  {
    label: "CELO_ELIGIBILITY",
    path: eligibilityPath,
    extraClaims: ["2026-06-13 local eligibility and proof-readiness checks"],
  },
  {
    label: "HACKATHON_SUBMISSION",
    path: hackathonSubmissionPath,
  },
  {
    label: "SMART_CONTRACT_TEAM_NOTES",
    path: smartContractNotesPath,
    extraClaims: [
      "github-contracts-6a45563-2026-06-13",
      "https://github.com/Nant361/langclaw-celo/commit/6a455639853fd0d5d1492af2fb076169a4057ce1",
    ],
  },
  {
    label: "CAMPAIGN_PROGRESS_2026-06-13",
    path: campaignProgressJune13Path,
    extraClaims: [
      "Monorepo workspace",
      "6a45563",
      "github-contracts-6a45563-2026-06-13",
      "https://github.com/Nant361/langclaw-celo/commit/6a455639853fd0d5d1492af2fb076169a4057ce1",
    ],
  },
];

const expectedClaims = [
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
  "0x2a885db5be7aa9553e0db14693ddf7e17b6898b5cc16246a62ad05f38136cae3",
  "0x2a2f94c40e2b5c080bd330f43f3ce6bc6b05e054b6626ce3ab2716220f0d3211",
  "Decision `#56`",
  "campaign-contracts-proof",
  "Decision `#1`",
  "smart-money",
];

test("backend Celo runbook docs stay aligned on live proof claims", () => {
  for (const file of sourceFiles) {
    const source = readFileSync(file.path, "utf8");

    for (const claim of expectedClaims) {
      assert.ok(
        source.includes(claim),
        `Expected ${file.label} to include ${claim}`
      );
    }

    for (const claim of file.extraClaims ?? []) {
      assert.ok(
        source.includes(claim),
        `Expected ${file.label} to include ${claim}`
      );
    }
  }
});
