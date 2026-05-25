# Langclaw Frontend

Next.js interface for **Langclaw Celo Alpha Sentinel**, with MiniPay-ready wallet auth and USDT usage credits.

The app gives users a Celo-first AI Alpha & Data workspace for:

- smart-money and holder-flow monitoring
- liquidity anomaly analysis
- Celo protocol / yield momentum checks
- Strategy Lab backtesting and paper-trading proof for Celo pairs
- source evidence inspection
- Alpha Watchlist for Supabase-backed saved follow-up signals
- on-chain agent decision proof display
- Proof Center for registry decision history
- MiniPay-aware USDT wallet and credits flows

## Local Setup

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

The frontend talks to the backend through `NEXT_PUBLIC_LANGCLAW_API_URL`. By default, use:

```bash
NEXT_PUBLIC_LANGCLAW_API_URL=http://localhost:3001
```

## Demo Flow

Use Celo Intelligence mode with:

```text
Analyze holder flow and smart-money signals on Celo token 0x471EcE3750Da237f93B8E339c536989b8978a438
```

Then:

```text
Rank Celo protocols by TVL and yield momentum
```

The response should show source-backed signals, risk notes, provider evidence, and the `Agent decision proof` panel when backend proof anchoring is enabled.

Click **Add to watchlist** on a Celo Intelligence result, then open `/watchlist` to review saved alpha signals. Open `/strategy` to run the Dune-backed Celo Liquidity Momentum Strategy, review equity curve/trades, and open a paper trade proof. Open `/proofs` to inspect the latest on-chain registry decisions and Strategy Proofs for the ERC-8004 agent.

Celo Intelligence requests reserve and settle the user's internal selected-chain usage balance through the backend billing ledger. USDT-backed credits on Celo are the default. MNT-backed credits on Mantle remain available as an optional chain.

When opened inside MiniPay, the app detects `window.ethereum.isMiniPay`, switches to Celo mainnet (`42220`), and uses the live Celo / USDT path for account access and usage credits.

## Live Proof Contracts

| Chain | `LangclawRegistry` | `LangclawTradingJournal` | `LangclawUsageVault` |
| --- | --- | --- | --- |
| Mantle | `0xe69755e4249c4978c39fbe847ca9674ce7af3505` | `0xe96e9b76af8c8f32bfa2235d647186826d92fb7d` | `0x7e93Ef361e7b54297cF963977bA829E47E59e8E1` |
| Celo | `0xe69755e4249c4978c39fbe847ca9674ce7af3505` | `0x69984c20176704685236fd633192d7de1c13a5ec` | `0x837a2948586de4e7638c742f99e520ffc049bcf7` |

Celo usage vault deposit token:

```text
0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e
```

Celo ERC-8004 agent ID:

```text
9109
```

Strategy Lab journal proofs are already configured against the live backend deployments. Local clones without `{MANTLE,CELO}_LANGCLAW_TRADING_JOURNAL_ADDRESS` still run backtests, but Proof Center will honestly show the journal as not configured.

## Verification

```bash
pnpm typecheck
pnpm build
```
