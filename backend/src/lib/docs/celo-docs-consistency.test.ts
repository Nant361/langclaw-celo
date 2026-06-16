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
const campaignProgressJune14Path = path.join(
  backendRoot,
  "docs",
  "CAMPAIGN_PROGRESS_2026-06-14.md"
);
const campaignProgressJune15Path = path.join(
  backendRoot,
  "docs",
  "CAMPAIGN_PROGRESS_2026-06-15.md"
);
const campaignProgressJune16Path = path.join(
  backendRoot,
  "docs",
  "CAMPAIGN_PROGRESS_2026-06-16.md"
);

const sourceFiles = [
  { label: "README", path: readmePath },
  {
    label: "CELO_ELIGIBILITY",
    path: eligibilityPath,
    getExtraClaims: (version: "72" | "60" | "59") => [
      version === "72"
        ? "2026-06-16 local eligibility and proof-readiness checks"
        : version === "60"
        ? "2026-06-14 local eligibility and proof-readiness checks"
        : "2026-06-13 local eligibility and proof-readiness checks"
    ],
  },
  {
    label: "HACKATHON_SUBMISSION",
    path: hackathonSubmissionPath,
    getExtraClaims: (version: "72" | "60" | "59") => [
      version === "72"
        ? "Latest registry decision `#72` is readable on Celo for agent `9109`"
        : version === "60"
        ? "Latest registry decision `#60` is readable on Celo for agent `9109`"
        : "Latest registry decision `#59` is readable on Celo for agent `9109`",
    ],
  },
  {
    label: "SMART_CONTRACT_TEAM_NOTES",
    path: smartContractNotesPath,
    getExtraClaims: (version: "72" | "60" | "59") => version === "72" || version === "60"
      ? [
          "github-backend-42ba30a-2026-06-14",
          "https://github.com/Nant361/langclaw-celo/commit/42ba30abed2f79d898058c9cc8fcbff30df754d1",
        ]
      : [
          "github-backend-45cdee4-2026-06-14",
          "https://github.com/Nant361/langclaw-celo/commit/45cdee4fc982e96b6e1b85d4cc83798f647b6314",
        ],
  },
  {
    label: "CAMPAIGN_PROGRESS_2026-06-14",
    path: campaignProgressJune14Path,
    getExtraClaims: (version: "72" | "60" | "59") => version === "72" || version === "60"
      ? [
          "Monorepo workspace",
          "42ba30a",
          "github-backend-42ba30a-2026-06-14",
          "https://github.com/Nant361/langclaw-celo/commit/42ba30abed2f79d898058c9cc8fcbff30df754d1",
        ]
      : [
          "Monorepo workspace",
          "45cdee4",
          "github-backend-45cdee4-2026-06-14",
          "https://github.com/Nant361/langclaw-celo/commit/45cdee4fc982e96b6e1b85d4cc83798f647b6314",
        ],
  },
  {
    label: "CAMPAIGN_PROGRESS_2026-06-15",
    path: campaignProgressJune15Path,
    getExtraClaims: (version: "72" | "60" | "59") => version === "72" || version === "60"
      ? [
          "Monorepo workspace",
          "7c4da9b",
          "github-backend-42ba30a-2026-06-14",
          "https://github.com/Nant361/langclaw-celo/commit/42ba30abed2f79d898058c9cc8fcbff30df754d1",
        ]
      : [
          "Monorepo workspace",
          "45cdee4",
          "github-backend-45cdee4-2026-06-14",
          "https://github.com/Nant361/langclaw-celo/commit/45cdee4fc982e96b6e1b85d4cc83798f647b6314",
        ],
  },
  {
    label: "CAMPAIGN_PROGRESS_2026-06-16",
    path: campaignProgressJune16Path,
    getExtraClaims: (version: "72" | "60" | "59") => version === "72" || version === "60"
      ? [
          "Monorepo workspace",
          "f431267",
          "github-backend-42ba30a-2026-06-14",
          "https://github.com/Nant361/langclaw-celo/commit/42ba30abed2f79d898058c9cc8fcbff30df754d1",
        ]
      : [
          "Monorepo workspace",
          "45cdee4",
          "github-backend-45cdee4-2026-06-14",
          "https://github.com/Nant361/langclaw-celo/commit/45cdee4fc982e96b6e1b85d4cc83798f647b6314",
        ],
  },
];

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
  "Decision `#1`",
  "smart-money",
];

test("backend Celo runbook docs stay aligned on live proof claims", () => {
  for (const file of sourceFiles) {
    const source = readFileSync(file.path, "utf8");
    let version: "72" | "60" | "59" = "59";
    if (
      source.includes("Decision `#72`") ||
      source.includes("decision `#72`") ||
      source.includes("ERC-8004 decision 72")
    ) {
      version = "72";
    } else if (
      source.includes("Decision `#60`") ||
      source.includes("decision `#60`") ||
      source.includes("ERC-8004 decision 60")
    ) {
      version = "60";
    }

    const versionClaims =
      version === "72"
        ? [
            "0xb52981a7282b5d48990c2d4bb69b313dbea74198f268b8a48b9cf72d56251481",
            "Decision `#72`",
            "campaign-backend-proof",
          ]
        : version === "60"
        ? [
            "0x42de71d7afe5e2500a1369b49525ae57b04f2c8ca7e7f358ddc052b63ba27677",
            "Decision `#60`",
            "campaign-backend-proof",
          ]
        : [
            "0x67514654c1751b48506f3511ac42d463673520308612df8fc5e225cbf398ce77",
            "Decision `#59`",
            "campaign-backend-proof",
          ];

    for (const claim of expectedBaseClaims) {
      assert.ok(
        source.includes(claim),
        `Expected ${file.label} to include base claim ${claim}`
      );
    }

    for (const claim of versionClaims) {
      assert.ok(
        source.includes(claim),
        `Expected ${file.label} to include version claim ${claim}`
      );
    }

    const extraClaims = file.getExtraClaims ? file.getExtraClaims(version) : [];
    for (const claim of extraClaims) {
      assert.ok(
        source.includes(claim),
        `Expected ${file.label} to include extra claim ${claim}`
      );
    }
  }
});
