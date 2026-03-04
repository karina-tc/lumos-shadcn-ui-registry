"use client";

import type { RenderElementProps } from "slate-react";

export interface MentionElementData {
  type: "mention";
  tag: string;
  name: string;
  icon: string;
  itemId: string;
  objectType: "app" | "knowledge" | "attribute" | "identity";
  children: [{ text: "" }];
}

export function AlbusMentionElement({
  attributes,
  children,
  element,
}: RenderElementProps) {
  const mention = element as unknown as MentionElementData;
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-mention-id={mention.itemId}
      className="mx-0.5 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 align-baseline font-medium text-[0.8125rem] text-blue-900 leading-[1.4]"
    >
      <span className="text-xs" aria-hidden="true">
        {mention.icon}
      </span>
      <span>@{mention.tag}</span>
      {children}
    </span>
  );
}
