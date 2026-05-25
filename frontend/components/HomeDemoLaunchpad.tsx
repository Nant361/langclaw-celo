import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRightIcon,
  BarChart3Icon,
  CheckCircle2Icon,
  DatabaseIcon,
  FlaskConicalIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const strategySteps = [
  "Discover active chain markets",
  "Backtest liquidity momentum",
  "Publish paper-trade decision",
  "Verify decision journal",
];

export default function HomeDemoLaunchpad() {
  return (
    <section className="mx-3 rounded-md border bg-[linear-gradient(180deg,var(--background),var(--muted))] px-4 py-8 sm:mx-5 md:px-8 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">AI Market Intelligence</Badge>
            <Badge variant="outline">Celo-ready proof</Badge>
          </div>
          <h2 className="max-w-xl font-semibold text-2xl tracking-tight sm:text-3xl md:text-5xl">
            Turn market data into verifiable strategy intelligence.
          </h2>
          <p className="max-w-2xl text-muted-foreground text-sm sm:text-base">
            Langclaw helps operators discover active Celo markets, test
            AI-guided strategy signals, and publish transparent paper-trading outcomes.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/strategy">
                <FlaskConicalIcon data-icon="inline-start" />
                Open Strategy Lab
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/proofs">
                <ShieldCheckIcon data-icon="inline-start" />
                View Proof Center
              </Link>
            </Button>
          </div>
        </div>

        <Card className="rounded-md" size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3Icon />
              Strategy intelligence
            </CardTitle>
            <CardDescription>
              Multi-chain Liquidity Momentum Strategy with transparent paper
              execution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <PreviewMetric label="PnL" value="+648 bps" />
              <PreviewMetric label="Win rate" value="64%" />
              <PreviewMetric label="Trades" value="14" />
            </div>

            <div className="mt-4 grid gap-2">
              {strategySteps.map((step, index) => (
                <div
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  key={step}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {index < 3 ? (
                      <CheckCircle2Icon className="shrink-0 text-primary" />
                    ) : (
                      <ShieldCheckIcon className="shrink-0 text-primary" />
                    )}
                    <span className="truncate">{step}</span>
                  </span>
                  <Badge variant={index < 3 ? "secondary" : "outline"}>
                    {index < 3 ? "active" : "journal"}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ProofSource
                icon={<DatabaseIcon />}
                label="Dune rows"
                value="pair, price, liquidity, volume"
              />
              <ProofSource
                icon={<ArrowRightIcon />}
                label="Strategy journal"
                value="signals, backtests, outcomes"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border px-3 py-2">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 font-semibold text-xl">{value}</p>
    </div>
  );
}

function ProofSource({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 gap-3 rounded-md border bg-muted/30 px-3 py-2">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="font-medium text-sm">{label}</p>
        <p className="truncate text-muted-foreground text-xs">{value}</p>
      </div>
    </div>
  );
}
