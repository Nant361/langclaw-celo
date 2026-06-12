# Campaign Progress Snapshot: 2026-06-12

This snapshot records the local repo-visible Langclaw Celo campaign state after running the daily eligibility check and verifying all core services.

## Local Workspace Head

| Scope | Branch | Head |
| --- | --- | --- |
| Monorepo workspace | `main` | `b2f9ffd` |

The public campaign surfaces continue to be tracked in the single git root repository. 

## Repo-Tracked Celo Proof References

| Item | Value |
| --- | --- |
| Product chain | Celo mainnet `42220` |
| `LangclawRegistry` | `0xe69755e4249c4978c39fbe847ca9674ce7af3505` |
| `LangclawTradingJournal` | `0x69984c20176704685236fd633192d7de1c13a5ec` |
| `LangclawUsageVault` | `0x837a2948586de4e7638c742f99e520ffc049bcf7` |
| Usage vault deposit token | `0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e` |
| ERC-8004 identity registry | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| Agent wallet / recorder | `0x2cA915EF6be8D2D48ccD3c5dAF715546AF873A4c` |
| ERC-8004 agent ID | `9109` |
| Self Agent ID | `133` |
| ERC-8004 registration tx | `0x1b7cb74378db42551a3cbc81dcd560f337df1593d4ef1cd70ee44ff269bdc7f3` |
| Self Agent ID registration tx | `0x3c7d0cc69f77d2aef5ab21bfe703d0f33f7037d5e2162209d78b23b5c3f1cde6` |
| Latest ERC-8004 decision proof | Decision `#50`, signal `campaign-backend-proof`, tx `0x5a6dc627b49d11a37ae27e6a4c0c88aebee5d3942a643167657d9b63dec833ce` |
| Latest Self-linked decision proof | Decision `#1`, signal `smart-money`, tx `0x2a2f94c40e2b5c080bd330f43f3ce6bc6b05e054b6626ce3ab2716220f0d3211` |
| Latest ERC-8004 proof run | `github-backend-a4ccbc1-2026-06-11` |
| Latest ERC-8004 proof evidence | `https://github.com/Nant361/langclaw-celo/commit/a4ccbc182ee51ae99c9dec2d7dde7ad282c36ec7` |

## Eligibility and Proof Readiness Status

- Run `npm run check:eligibility` successfully. All sub-scopes (`backend`, `frontend`, `contracts`, and `.github`) report `Eligible now` with remote origin configured.
- Run `npm run check:celo-proof` successfully. The readiness is `ready` because the default proof path prefers the ERC-8004 campaign agent `9109`.
- Verified that all contracts are fully verified on Celoscan, and tests are passing locally (backend: 195 tests, frontend: 25 tests, contracts: 52 tests).

## Correctness and Maintenance Completed

- Refreshed Celo proof references in the workspace head commits to point correctly to decision `#50`.
- Verified that the backend, frontend, and smart contract verification pipelines remain fully functional.
