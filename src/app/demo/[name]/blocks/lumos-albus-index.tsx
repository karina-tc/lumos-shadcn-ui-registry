"use client";

import { useState } from "react";
import { LumosLayout } from "@/components/lumos-layout";
import { AlbusChatInput } from "@/components/albus-chat-input";
import { AlbusSymbol } from "@/components/albus-symbol";

const suggestions = [
  "I'm new here! How can you help me?",
  "Tell me about features in Lumos.",
  "Show me access patterns across my organization.",
  "Find my identities with the largest number of risky access.",
];

export default function LumosAlbusIndex() {
  const [value, setValue] = useState("");

  return (
    <LumosLayout activeItem="Ask Albus" title="Ask Albus">
      <div className="flex h-full items-center justify-center p-5">
        <div className="flex w-full max-w-[560px] flex-col items-center gap-2.5">
          <div className="flex size-11 flex-col items-center justify-center">
            <AlbusSymbol className="size-full" />
          </div>
          <p className="text-2xl font-medium leading-[1.5] text-foreground">What can I help you with?</p>
          <div className="flex w-full items-center justify-center px-5 pb-5 text-center text-sm leading-[1.4] text-muted-foreground">
            Albus knows your company's tools, teams, and policies — just ask
          </div>
          <AlbusChatInput
            value={value}
            onChange={setValue}
            placeholder="Ask me anything"
            suggestions={suggestions}
            suggestionsPosition="bottom"
            showModeSelector
          />
        </div>
      </div>
    </LumosLayout>
  );
}
