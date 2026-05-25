import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
      <nav className="flex min-w-0 items-center gap-4">
        <p className="truncate text-xl font-bold">
          <Link href={"/"}>Langclaw</Link>
        </p>
        <p className="hidden text-sm text-muted-foreground sm:block">
          <Link href={"/"}>Documentation</Link>
        </p>
      </nav>
      <Button asChild size="sm">
        <Link href={"/chat"}>Open App</Link>
      </Button>
    </header>
  );
}
