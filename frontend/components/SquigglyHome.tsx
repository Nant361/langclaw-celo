"use client";
import React from "react";
import { SquigglyText } from "@/components/ui/squiggly-text";

export function SquigglyHome() {
  return (
    <div className="flex min-h-[26rem] w-full items-center justify-center px-4 py-14 sm:min-h-[32rem]">
      <h1 className="text-center font-bold text-3xl leading-tight text-foreground sm:text-5xl md:text-7xl lg:text-8xl">
        Independent{" "}
        <SquigglyText stepDuration={70} scale={[6, 9]} className="text-primary">
          Research Identity
        </SquigglyText>{" "}
        <br />
        for <SquigglyText scale={5}> AI Agents</SquigglyText>
      </h1>
    </div>
  );
}
