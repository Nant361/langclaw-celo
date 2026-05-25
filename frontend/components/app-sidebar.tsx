"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import {
  Cable,
  CalendarSync,
  ChevronDown,
  CircleFadingPlus,
  Cpu,
  CreditCard,
  Database,
  Bookmark,
  FlaskConical,
  LogOut,
  MessagesSquare,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Settings,
  ShieldCheck,
  Trash2,
  User2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { erc20Abi, formatUnits } from "viem";
import {
  useBalance,
  useChainId,
  useChains,
  useConnection,
  useDisconnect,
  useReadContract,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  CHAT_SESSIONS_UPDATED_EVENT,
  deleteChatSession,
  dispatchChatSessionsUpdated,
  listChatSessions,
  type ChatSession,
  updateChatSessionMetadata,
} from "@/lib/langclaw-api";
import {
  readCachedWalletAuth,
  useWalletSession,
  WALLET_AUTH_UPDATED_EVENT,
} from "@/hooks/use-wallet-session";
import { useIsMiniPay } from "@/hooks/use-minipay";
import { Badge } from "./ui/badge";
import { productChainOptions } from "@/lib/chains";
import { isMiniPayProvider } from "@/lib/minipay";

export function AppSidebar() {
  const { isConnected, address } = useConnection();
  const { connectError, getWalletAuth, isConnecting, openWalletModal } =
    useWalletSession();
  const isMiniPay = useIsMiniPay();
  // const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [sessionsError, setSessionsError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ChatSession | null>(null);
  const [renameTarget, setRenameTarget] = useState<ChatSession | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const chains = useChains();
  const activeChainId = useChainId();
  const activeProductChain = useMemo(
    () => productChainOptions.find((chain) => chain.chainId === activeChainId),
    [activeChainId],
  );
  const billingCurrency = activeProductChain?.billingCurrency;
  const billingTokenAddress = billingCurrency?.tokenAddress as
    | `0x${string}`
    | undefined;
  const isTokenBilling = Boolean(billingTokenAddress);
  const { data: nativeBalanceUser } = useBalance({
    address: address,
    query: { enabled: Boolean(address && !isTokenBilling) },
  });
  const { data: tokenBalanceUserData } = useReadContract({
    abi: erc20Abi,
    address: billingTokenAddress,
    args: [
      (address as `0x${string}` | undefined) ??
        "0x0000000000000000000000000000000000000000",
    ],
    chainId: activeChainId,
    functionName: "balanceOf",
    query: {
      enabled: Boolean(address && billingTokenAddress && isTokenBilling),
    },
  });
  const balanceUser = useMemo(
    () =>
      isTokenBilling && typeof tokenBalanceUserData === "bigint"
        ? {
            decimals: billingCurrency?.decimals ?? 18,
            symbol: billingCurrency?.symbol ?? "",
            value: tokenBalanceUserData,
          }
        : nativeBalanceUser,
    [
      billingCurrency,
      isTokenBilling,
      nativeBalanceUser,
      tokenBalanceUserData,
    ],
  );
  const balanceLabel = useMemo(() => {
    if (!balanceUser) return null;
    return `${formatUnits(balanceUser.value, balanceUser.decimals).slice(0, 5)} ${balanceUser.symbol}`;
  }, [balanceUser]);
  const activeChain = useMemo(
    () => chains.find((chain) => chain.id === activeChainId) ?? chains[0],
    [activeChainId, chains],
  );
  const disconnect = useDisconnect();
  const pinnedSessions = useMemo(
    () => sessions.filter((session) => session.pinned),
    [sessions],
  );
  const recentSessions = useMemo(
    () => sessions.filter((session) => !session.pinned),
    [sessions],
  );
  const accountLabel = isMiniPay
    ? "MiniPay account"
    : address
      ? `${address.slice(0, 4)}...${address.slice(-4)}`
      : "Wallet";

  const refreshSessions = useCallback(async () => {
    if (!isConnected || !address) {
      setSessions([]);
      setSessionsError("");
      setIsLoadingSessions(false);
      return;
    }

    setIsLoadingSessions(true);

    try {
      const cachedWallet = readCachedWalletAuth(address);

      if (isMiniPayProvider() && !cachedWallet) {
        setSessions([]);
        setSessionsError("");
        return;
      }

      const wallet = cachedWallet ?? (await getWalletAuth());
      const nextSessions = await listChatSessions(wallet);
      setSessions(nextSessions);
      setSessionsError("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load chats.";
      setSessions([]);
      setSessionsError(message);
      toast.error(message);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [address, getWalletAuth, isConnected]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshSessions();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshSessions]);

  // useEffect(() => {
  //   const timeoutId = window.setTimeout(() => {
  //     void checkBackendHealth()
  //       .then(() => setBackendOnline(true))
  //       .catch(() => {
  //         setBackendOnline(false);
  //         toast.error("Backend offline");
  //       });
  //   }, 0);

  //   return () => window.clearTimeout(timeoutId);
  // }, []);

  useEffect(() => {
    window.addEventListener(CHAT_SESSIONS_UPDATED_EVENT, refreshSessions);
    window.addEventListener(WALLET_AUTH_UPDATED_EVENT, refreshSessions);

    return () => {
      window.removeEventListener(CHAT_SESSIONS_UPDATED_EVENT, refreshSessions);
      window.removeEventListener(WALLET_AUTH_UPDATED_EVENT, refreshSessions);
    };
  }, [refreshSessions]);

  const handleTogglePinned = useCallback(
    async (session: ChatSession) => {
      try {
        const wallet = await getWalletAuth();
        const updated = await updateChatSessionMetadata(wallet, {
          pinned: !session.pinned,
          sessionId: session.id,
        });
        setSessions((current) =>
          current.map((item) =>
            item.id === session.id
              ? {
                  ...item,
                  ...(updated ?? {}),
                  messages: item.messages,
                  pinned: updated?.pinned ?? !session.pinned,
                }
              : item,
          ),
        );
        dispatchChatSessionsUpdated();
        toast.success(session.pinned ? "Chat unpinned" : "Chat pinned");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to update chat.",
        );
      }
    },
    [getWalletAuth],
  );

  const openRenameDialog = useCallback((session: ChatSession) => {
    setRenameTarget(session);
    setRenameTitle(session.title);
  }, []);

  const handleRenameSession = useCallback(async () => {
    if (!renameTarget) {
      return;
    }

    const title = renameTitle.trim().replace(/\s+/g, " ");

    if (!title) {
      toast.error("Chat title is required");
      return;
    }

    try {
      const wallet = await getWalletAuth();
      const updated = await updateChatSessionMetadata(wallet, {
        sessionId: renameTarget.id,
        title,
      });
      setSessions((current) =>
        current.map((item) =>
          item.id === renameTarget.id
            ? {
                ...item,
                ...(updated ?? {}),
                messages: item.messages,
                title: updated?.title ?? title,
              }
            : item,
        ),
      );
      setRenameTarget(null);
      setRenameTitle("");
      dispatchChatSessionsUpdated();
      toast.success("Chat renamed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to rename chat.",
      );
    }
  }, [getWalletAuth, renameTarget, renameTitle]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      const wallet = await getWalletAuth();
      await deleteChatSession(wallet, deleteTarget.id);
      setSessions((current) =>
        current.filter((session) => session.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      dispatchChatSessionsUpdated();
      toast.success("Chat deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete chat.",
      );
    }
  }, [deleteTarget, getWalletAuth]);

  // if (isReconnecting) {
  //   <p>hai</p>;
  // }

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link href={"/"}>
          <span className="text-lg font-bold mb-5">Langclaw</span>
        </Link>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/chat">
              <CircleFadingPlus />
              <span>New Chat</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/task">
              <CalendarSync />
              <span>Automation Task</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/usage">
              <Database />
              <span>Usage</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/watchlist">
              <Bookmark />
              <span>Alpha Watchlist</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/strategy">
              <FlaskConical />
              <span>Strategy Lab</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/proofs">
              <ShieldCheck />
              <span>Proof Center</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/key">
              <Cable />
              <span>API Console</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/memory">
              <Cpu />
              <span>Memory</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/settings">
              <Settings />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {/* PINNED CHAT  */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Pinned
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SessionMenuItems
                    emptyLabel={
                      isConnected ? "No pinned chats" : "Connect to load chats"
                    }
                    isLoading={isLoadingSessions}
                    onDeleteRequest={setDeleteTarget}
                    onRenameRequest={openRenameDialog}
                    onTogglePinned={handleTogglePinned}
                    sessions={pinnedSessions}
                  />
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* RECENTS CHAT  */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Recents
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SessionMenuItems
                    emptyLabel={
                      isConnected ? "No recent chats" : "Connect to load chats"
                    }
                    isLoading={isLoadingSessions}
                    onDeleteRequest={setDeleteTarget}
                    onRenameRequest={openRenameDialog}
                    onTogglePinned={handleTogglePinned}
                    sessions={recentSessions}
                  />
                </SidebarMenu>
                {sessionsError && (
                  <p className="px-2 pt-2 text-xs text-destructive">
                    {sessionsError}
                  </p>
                )}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        {isConnected ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="bg-primary text-primary-foreground">
                    <User2 />
                    <p>{accountLabel}</p>
                    <Badge variant={"secondary"}>
                      {isMiniPay ? "Celo / USDT" : activeChain?.name}
                    </Badge>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <CreditCard />
                    <span>{balanceLabel ?? "-"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => disconnect.mutate()}>
                    <LogOut />
                    <span>{isMiniPay ? "Disconnect account" : "Disconnect Wallet"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SidebarMenu>
            {isMiniPay ? (
              <div className="flex flex-col gap-2">
                <Badge variant="outline">
                  {isConnecting ? "Connecting to MiniPay" : "MiniPay access"}
                </Badge>
                {!isConnecting && (
                  <Button onClick={openWalletModal} type="button" variant="outline">
                    Retry access
                  </Button>
                )}
                {connectError && (
                  <p className="text-xs text-destructive">
                    Unlock MiniPay and try again.
                  </p>
                )}
              </div>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </Button>
                )}
              </ConnectButton.Custom>
            )}
          </SidebarMenu>
        )}
      </SidebarFooter>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setRenameTarget(null);
            setRenameTitle("");
          }
        }}
        open={Boolean(renameTarget)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
            <DialogDescription>
              Update the title shown in pinned and recent chats.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void handleRenameSession();
            }}
          >
            <Input
              autoFocus
              maxLength={120}
              onChange={(event) => setRenameTitle(event.currentTarget.value)}
              value={renameTitle}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        open={Boolean(deleteTarget)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete chat?</DialogTitle>
            <DialogDescription>
              This removes the saved session and its messages.
            </DialogDescription>
          </DialogHeader>
          <p className="truncate font-medium">{deleteTarget?.title}</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => void handleConfirmDelete()}
              type="button"
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}

function SessionMenuItems({
  emptyLabel,
  isLoading,
  onDeleteRequest,
  onRenameRequest,
  onTogglePinned,
  sessions,
}: {
  emptyLabel: string;
  isLoading: boolean;
  onDeleteRequest: (session: ChatSession) => void;
  onRenameRequest: (session: ChatSession) => void;
  onTogglePinned: (session: ChatSession) => Promise<void>;
  sessions: ChatSession[];
}) {
  if (isLoading) {
    return (
      <>
        <SidebarMenuSkeleton showIcon />
        <SidebarMenuSkeleton showIcon />
        <SidebarMenuSkeleton showIcon />
      </>
    );
  }

  if (!sessions.length) {
    return (
      <SidebarMenuItem>
        <p className="px-2 py-1 text-xs text-muted-foreground">{emptyLabel}</p>
      </SidebarMenuItem>
    );
  }

  return sessions.map((session) => (
    <SidebarMenuItem key={session.id}>
      <SidebarMenuButton asChild tooltip={session.title}>
        <Link href={`/chat/${session.id}`}>
          <MessagesSquare />
          <span>{session.title}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            aria-label={`Open actions for ${session.title}`}
            showOnHover
          >
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right">
          <DropdownMenuItem onClick={() => onRenameRequest(session)}>
            <Pencil />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void onTogglePinned(session)}>
            {session.pinned ? <PinOff /> : <Pin />}
            <span>{session.pinned ? "Unpin" : "Pin"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDeleteRequest(session)}
            variant="destructive"
          >
            <Trash2 />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  ));
}
