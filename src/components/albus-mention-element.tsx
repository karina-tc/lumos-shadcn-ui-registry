"use client";

import type { RenderElementProps } from "slate-react";

export interface MentionElementData {
  type: "mention";
  tag: string;
  name: string;
  itemId: string;
  objectType:
    | "app"
    | "identity"
    | "policy"
    | "entitlement"
    | "reports"
    | "access-review"
    | "access-request";
  filterAttribute?: string;
  filterValue?: string;
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
      className="mx-0.5 inline-flex items-center gap-0.5 rounded-md bg-blue-100 px-1.5 py-0.5 align-baseline font-medium text-[0.8125rem] text-blue-800 leading-[1.4]"
    >
      <span className="text-blue-500">@</span>
      <span>{mention.tag}</span>
      {children}
    </span>
  );
}
