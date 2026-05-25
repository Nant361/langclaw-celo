import {
  Blocks,
  Bot,
  CalendarSync,
  FileCog,
  MessagesSquare,
  Rss,
} from "lucide-react";
import { PointerHighlight } from "./ui/pointer-highlight";
import { ShineBorder } from "./ui/shine-border";

export default function Capabilities() {
  return (
    <section className="relative m-3 overflow-hidden rounded-md border bg-card sm:m-5">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <div className="flex flex-col gap-3 px-4 py-6 sm:px-8 md:px-12">
        <div className="text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">
          Six Core Capabilities to Build Your
          <PointerHighlight>
            <span>AI Agent</span>
          </PointerHighlight>
        </div>
        <h2 className="text-muted-foreground text-sm sm:text-base">
          Chat / Models / Multi-Agent / Channels Skills / Scheduled Tasks
        </h2>
      </div>
      <div className="grid gap-5 px-4 pb-6 sm:px-8 md:px-12 md:pb-10">
        <section className="grid gap-5 md:grid-cols-3">
          <article className="flex flex-col gap-3 border-b pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            <MessagesSquare className="size-9" />
            <h3 className="text-xl font-bold text-primary">
              Smart Interaction
            </h3>
            <h4 className="font-semibold">Conversational Chat Interface</h4>
            <p>
              Immersive chat experience with Markdown rendering, code
              highlighting, and conversation history.
            </p>
          </article>

          <article className="flex flex-col gap-3 border-b pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            <Bot className="size-9" />
            <h3 className="text-xl font-bold text-primary">Agent Management</h3>
            <h4 className="font-semibold">Multi-Agent Smart Routing</h4>
            <p>
              Create and manage multiple AI assistants, each with its own
              configuration.
            </p>
          </article>

          <article className="flex flex-col gap-3 border-b pb-4 md:border-b-0 md:pb-0">
            <Rss className="size-9" />
            <h3 className="text-xl font-bold text-primary">
              Channel Management
            </h3>
            <h4 className="font-semibold">Multi-Platform Account Binding</h4>
            <p>
              Immersive chat experience with Markdown rendering, code
              highlighting, and conversation history.
            </p>
          </article>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <article className="flex flex-col gap-3 border-b pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            <CalendarSync className="size-9" />
            <h3 className="text-xl font-bold text-primary">Automation</h3>
            <h4 className="font-semibold">Scheduled Task Scheduler</h4>
            <p>
              Visual cron configuration for setting trigger conditions and
              intervals. Let AI execute tasks automatically around the clock.
            </p>
          </article>

          <article className="flex flex-col gap-3 border-b pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            <Blocks className="size-9" />
            <h3 className="text-xl font-bold text-primary">Skill Extension</h3>
            <h4 className="font-semibold">Built-in Skill Marketplace</h4>
            <p>
              Graphical skill panel with no package manager needed. Browse,
              install, and manage skills with document processing and search
              capabilities pre-installed.
            </p>
          </article>

          <article className="flex flex-col gap-3">
            <FileCog className="size-9" />
            <h3 className="text-xl font-bold text-primary">System Settings</h3>
            <h4 className="font-semibold">One-Stop Configuration Center</h4>
            <p>
              Centralized management of themes, notifications, proxies, and
              more. Adaptive light/dark themes with launch-at-login support.
            </p>
          </article>
        </section>
      </div>
    </section>
  );
}
