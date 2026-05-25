"use client";

import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input";
import { ButtonGroup } from "@/components/ui/button-group";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { SpeechInput } from "@/components/ai-elements/speech-input";
import {
  Transcription,
  TranscriptionSegment,
} from "@/components/ai-elements/transcription";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  ActivityIcon,
  CpuIcon,
  MessageSquareIcon,
  SearchIcon,
} from "lucide-react";
import type { Experimental_TranscriptionResult } from "ai";
import { type ComponentType, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { SparklesText } from "./ui/sparkles-text";
import { useRouter } from "next/navigation";

import { createChatSession, savePendingPrompt } from "@/lib/chat-utils";
import {
  dispatchChatSessionsUpdated,
  isWalletSignatureRequiredError,
  readFriendlyError,
  type ChatMode,
  type ProductChainId,
  upsertChatSession,
} from "@/lib/langclaw-api";
import { defaultProductChain } from "@/lib/chains";
import { useWalletSession } from "@/hooks/use-wallet-session";
import { useIsMiniPay } from "@/hooks/use-minipay";
import {
  DEFAULT_CHAT_MODEL_ID,
  getModelLabel,
  useRouterModels,
} from "@/hooks/use-router-models";
import { Badge } from "@/components/ui/badge";
import {
  isTelegramLinkRequiredError,
  useTelegramConnectGate,
} from "@/components/TelegramConnectDialog";

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;
const CHAT_INPUT_SUGGESTIONS = [
  "Find smart-money accumulation on the selected chain",
  "Detect liquidity anomalies on selected-chain DEX pairs",
  "Rank protocols by TVL and yield momentum",
];

type TranscriptionSegments = Experimental_TranscriptionResult["segments"];

const ChatInputSuggestions = () => {
  const { textInput } = usePromptInputController();

  return (
    <Suggestions className="justify-start sm:justify-center">
      {CHAT_INPUT_SUGGESTIONS.map((suggestion) => (
        <Suggestion
          key={suggestion}
          onClick={textInput.setInput}
          suggestion={suggestion}
        />
      ))}
    </Suggestions>
  );
};

function ChatInputSpeechButton({
  onTranscript,
}: {
  onTranscript: (text: string) => void;
}) {
  const { textInput } = usePromptInputController();

  const handleTranscriptionChange = useCallback(
    (text: string) => {
      textInput.setInput(appendSpeechText(textInput.value, text));
      onTranscript(text);
    },
    [onTranscript, textInput],
  );

  return (
    <SpeechInput
      aria-label="Dictate prompt"
      lang="en-US"
      onTranscriptionChange={handleTranscriptionChange}
      size="icon-sm"
      variant="ghost"
    />
  );
}

function SpeechTranscriptionPreview({
  segments,
}: {
  segments: TranscriptionSegments;
}) {
  if (!segments.length) {
    return null;
  }

  return (
    <div className="border-b px-3 py-2">
      <Transcription segments={segments}>
        {(segment, index) => (
          <TranscriptionSegment
            index={index}
            key={`${segment.startSecond}-${segment.text}`}
            segment={segment}
          />
        )}
      </Transcription>
    </div>
  );
}

const ChatInput = () => {
  const router = useRouter();
  const isMiniPay = useIsMiniPay();
  const { clearWalletAuth, isConnected, isSigning, openWalletModal } =
    useWalletSession();
  const { dialog: telegramDialog, requireTelegramLinkedWallet } =
    useTelegramConnectGate();
  const { chatModels, error: modelsError, isLoading: isLoadingModels } =
    useRouterModels();
  const [selectedModel, setSelectedModel] = useState(DEFAULT_CHAT_MODEL_ID);
  const [selectedChain, setSelectedChain] =
    useState<ProductChainId>(defaultProductChain);
  const [toolMode, setToolMode] = useState<ChatMode>("chat");
  const [error, setError] = useState("");
  const [speechSegments, setSpeechSegments] = useState<TranscriptionSegments>(
    [],
  );
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

  const handleSpeechTranscript = useCallback((text: string) => {
    setSpeechSegments((segments) => appendTranscriptionSegment(segments, text));
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (isMiniPay) {
        setSelectedChain("celo");
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isMiniPay]);

  useEffect(() => {
    if (!chatModels.length) {
      return;
    }

    if (!chatModels.some((model) => model.id === selectedModel)) {
      const timeoutId = window.setTimeout(() => {
        setSelectedModel(chatModels[0].id);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [chatModels, selectedModel]);

  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      const text = message.text.trim();
      const hasText = Boolean(text);
      const hasAttachments = Boolean(message.files?.length);

      if (!(hasText || hasAttachments)) {
        return;
      }

      if (hasAttachments) {
        showError(
          setError,
          "File attachments are not supported by the current chat backend.",
        );
        setStatus("error");
        return;
      }

      if (!isConnected) {
        openWalletModal();
        showError(
          setError,
          isMiniPay
            ? "Connect your MiniPay account to start chatting."
            : "Choose a wallet to start chatting.",
        );
        setStatus("error");
        return;
      }

      setStatus("submitted");
      setError("");
      setSpeechSegments([]);

      const startSession = async (forceWalletSignature = false) => {
        const wallet = await requireTelegramLinkedWallet({
          chain: selectedChain,
          force: forceWalletSignature,
        });
        const session = createChatSession(text);

        savePendingPrompt(session.id, {
          chain: selectedChain,
          model: selectedModel,
          researchTrend: toolMode === "research",
          text,
          toolMode,
        });

        await upsertChatSession(wallet, session);
        dispatchChatSessionsUpdated();

        return session;
      };

      try {
        const session = await startSession();
        setStatus("streaming");
        toast.success("Chat session created", {
          description:
            toolMode === "research"
              ? "Alpha mode is ready."
              : toolMode === "onchain"
                ? "Intel mode is ready."
                : selectedModel,
        });

        setTimeout(() => {
          router.push(`/chat/${session.id}`);
        }, SUBMITTING_TIMEOUT);
      } catch (err) {
        if (isWalletSignatureRequiredError(err)) {
          try {
            clearWalletAuth();
            const session = await startSession(true);
            setStatus("streaming");
            toast.success("Wallet signature refreshed", {
              description: "Starting the chat session now.",
            });
            setTimeout(() => {
              router.push(`/chat/${session.id}`);
            }, SUBMITTING_TIMEOUT);
            return;
          } catch (retryErr) {
            showError(
              setError,
              readFriendlyError(retryErr, "Unable to start the chat session."),
            );
            setStatus("error");

            setTimeout(() => {
              setStatus("ready");
            }, STREAMING_TIMEOUT);
            return;
          }
        }

        if (isTelegramLinkRequiredError(err)) {
          setStatus("ready");
          return;
        }

        showError(
          setError,
          readFriendlyError(err, "Unable to start the chat session."),
        );
        setStatus("error");

        setTimeout(() => {
          setStatus("ready");
        }, STREAMING_TIMEOUT);
      }
    },
    [
      clearWalletAuth,
      isConnected,
      isMiniPay,
      openWalletModal,
      requireTelegramLinkedWallet,
      router,
      selectedModel,
      selectedChain,
      toolMode,
    ],
  );

  return (
    <div className="mx-auto flex size-full min-h-[calc(100dvh-18rem)] min-w-0 flex-col items-center justify-center gap-5 overflow-hidden px-1 pb-10 pt-4 sm:px-4 md:min-h-[calc(100dvh-15rem)] md:gap-8 md:pb-4">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-2 text-center">
        {isMiniPay && (
          <Badge variant="secondary">MiniPay / Celo / USDT</Badge>
        )}
        <div className="flex w-full flex-col items-center justify-center gap-1 font-medium text-2xl leading-tight sm:flex-row sm:flex-wrap sm:items-end sm:gap-2 sm:text-3xl md:text-4xl">
          <span className="min-w-0 max-w-full">Ask</span>
          <SparklesText className="max-w-full text-4xl md:text-5xl">
            Langclaw
          </SparklesText>
        </div>
        <p className="max-w-xs text-muted-foreground text-sm sm:max-w-xl">
          Celo alpha, balances, and protocol signals with USDT credits.
        </p>
      </div>
      <PromptInputProvider>
        <PromptInput
          className="w-full max-w-md overflow-hidden sm:max-w-2xl"
          onSubmit={handleSubmit}
        >
          <SpeechTranscriptionPreview segments={speechSegments} />
          <PromptInputBody>
            <PromptInputTextarea />
          </PromptInputBody>
          <PromptInputFooter className="flex-wrap items-end gap-2">
            <PromptInputTools className="flex-1 flex-wrap gap-1.5">
              <ChatInputSpeechButton onTranscript={handleSpeechTranscript} />
              {isMiniPay ? <MiniPayChainPill /> : null}
              <ChatModeControl onChange={setToolMode} value={toolMode} />
              <ModelSelect
                models={chatModels}
                onChange={setSelectedModel}
                value={selectedModel}
              />
            </PromptInputTools>
            <PromptInputSubmit
              disabled={isSigning || !isConnected}
              status={status}
            />
          </PromptInputFooter>
        </PromptInput>
        <ChatInputSuggestions />
      </PromptInputProvider>
      {(error || modelsError) && (
        <p className="max-w-2xl text-center text-sm text-destructive">
          {error || (isLoadingModels ? "" : modelsError)}
        </p>
      )}
      {telegramDialog}
    </div>
  );
};

function showError(setError: (message: string) => void, message: string) {
  setError(message);
  toast.error(message);
}

function MiniPayChainPill() {
  return (
    <Badge className="h-8 rounded-md px-2 text-xs" variant="secondary">
      Celo / USDT
    </Badge>
  );
}

function ChatModeControl({
  onChange,
  value,
}: {
  onChange: (value: ChatMode) => void;
  value: ChatMode;
}) {
  const modes: Array<{
    icon: ComponentType<{ className?: string; size?: number }>;
    label: string;
    tooltip: string;
    value: ChatMode;
  }> = [
      {
        icon: MessageSquareIcon,
        label: "Chat",
        tooltip: "Chat directly with Langclaw.",
        value: "chat",
      },
      {
        icon: SearchIcon,
        label: "Alpha",
        tooltip: "Alpha: evidence-backed research brief.",
        value: "research",
      },
      {
        icon: ActivityIcon,
        label: "Intel",
        tooltip: "Intel: inspect network data tools.",
        value: "onchain",
      },
    ];

  return (
    <ButtonGroup className="max-w-full shrink-0">
      {modes.map((mode) => {
        const Icon = mode.icon;

        return (
          <PromptInputButton
            aria-pressed={value === mode.value}
            key={mode.value}
            onClick={() => onChange(mode.value)}
            tooltip={mode.tooltip}
            type="button"
            variant={value === mode.value ? "default" : "ghost"}
          >
            <Icon className="size-4" />
            <span>{mode.label}</span>
          </PromptInputButton>
        );
      })}
    </ButtonGroup>
  );
}

function ModelSelect({
  models,
  onChange,
  value,
}: {
  models: ReturnType<typeof useRouterModels>["chatModels"];
  onChange: (value: string) => void;
  value: string;
}) {
  const selectedModel = models.find((model) => model.id === value);

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger
        aria-label="Chat model"
        className="h-8 min-w-0 flex-1 basis-40 text-xs sm:w-[min(15rem,42vw)] sm:flex-none"
        size="sm"
      >
        <CpuIcon className="size-4 text-muted-foreground" />
        <span className="truncate">
          {selectedModel ? getModelLabel(selectedModel) : "GPT-5 mini"}
        </span>
      </SelectTrigger>
      <SelectContent align="start" className="max-w-80">
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {getModelLabel(model)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function appendSpeechText(currentText: string, transcript: string) {
  const next = transcript.trim();

  if (!next) {
    return currentText;
  }

  return currentText.trim() ? `${currentText.trim()} ${next}` : next;
}

function appendTranscriptionSegment(
  segments: TranscriptionSegments,
  text: string,
): TranscriptionSegments {
  const transcript = text.trim();

  if (!transcript) {
    return segments;
  }

  const startSecond = segments.at(-1)?.endSecond ?? 0;
  const duration = Math.max(1, Math.ceil(transcript.split(/\s+/).length / 2));

  return [
    ...segments,
    {
      endSecond: startSecond + duration,
      startSecond,
      text: transcript,
    },
  ];
}

export default ChatInput;
