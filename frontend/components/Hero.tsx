import React from "react";
import { DiaTextReveal } from "./ui/dia-text-reveal";
import { Button } from "./ui/button";
import { SendHorizontalIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";

export default function Hero() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-9rem)] max-w-4xl flex-col items-center justify-center gap-6 px-4 py-8 text-foreground sm:px-6 md:gap-8">
      <h1 className="max-w-3xl text-center font-semibold text-4xl leading-tight tracking-tight sm:text-5xl md:text-7xl">
        Ask Langclaw for{" "}
        <span className="block md:hidden">Celo alpha</span>
        <DiaTextReveal
          className="hidden md:inline-block"
          fixedWidth
          repeat
          repeatDelay={1.2}
          text={["find Celo alpha", "track USDT credits", "verify signals"]}
        />
      </h1>
      <section className="relative w-full max-w-2xl">
        <Textarea
          className="min-h-24 resize-none pr-14 text-base"
          placeholder="What would you like to know?"
        />
        <Button
          aria-label="Start chat"
          className="absolute right-2 top-2"
          size="icon-sm"
        >
          <SendHorizontalIcon />
        </Button>
      </section>
      <section className="max-w-xl text-center text-muted-foreground text-sm sm:text-base">
        <p>Mobile-first AI research for Celo signals, MiniPay users, and USDT credits.</p>
      </section>
    </div>
  );
}
