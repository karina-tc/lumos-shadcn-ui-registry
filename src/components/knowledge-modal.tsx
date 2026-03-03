"use client"

import { useState } from "react"
import { X, Info, Plus, AtSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UseWhenSelector, type UseWhenSelection } from "@/components/use-when-selector"
import { cn } from "@/lib/utils"

export interface KnowledgeModalProps {
  open?: boolean
  onClose?: () => void
  onSave?: (data: { name: string; useWhen: UseWhenSelection; context: string; isSensitive: boolean }) => void
}

const defaultUseWhenSelection: UseWhenSelection = {
  globalContext: true,
  useCases: [],
  productAreas: [],
  apps: [],
  entitlements: [],
}

export function KnowledgeModal({ open = true, onClose, onSave }: KnowledgeModalProps) {
  const [name, setName] = useState("")
  const [useWhen, setUseWhen] = useState<UseWhenSelection>(defaultUseWhenSelection)
  const [context, setContext] = useState("")
  const [isSensitive, setIsSensitive] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleSave = () => {
    onSave?.({ name, useWhen, context, isSensitive })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-2xl w-[680px] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[56px] flex-shrink-0">
          <h2 className="text-xl font-semibold text-foreground">Add Knowledge</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Divider below header */}
        <div className="border-t border-border" />

        {/* Form */}
        <div className="px-6 py-5 space-y-5">
          {/* Name Field */}
          <div className="flex items-center gap-4">
            <label className="text-sm text-muted-foreground flex-shrink-0 w-32">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Organizational Structure"
              className="flex-1 border-input bg-background shadow-none focus-visible:ring-primary/25 focus-visible:border-primary rounded-full"
            />
          </div>

          {/* Use When Field */}
          <div className="flex gap-4 items-start">
            <label className="text-sm text-muted-foreground flex-shrink-0 mt-2 w-32">Use Case</label>
            <UseWhenSelector value={useWhen} onChange={setUseWhen} />
          </div>

          {/* Context Field */}
          <div className="flex items-start gap-4 flex-col">
            <label className="w-24 text-sm text-muted-foreground flex-shrink-0 mt-3">Context</label>
            <div className="w-full">
              <div
                className={cn(
                  "rounded-xl border bg-background transition-all duration-200 w-full",
                  isFocused ? "border-primary ring-2 ring-primary/20" : "border-input"
                )}
              >
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={"What should Lumos know about?\n\nFor example:\n@team-engineering should only have viewer access to @app-figma"}
                  className="w-full bg-transparent text-sm text-foreground resize-none focus:outline-none p-4 min-h-[200px] placeholder:text-muted-foreground"
                />
                {/* Textarea Footer */}
                <div className="flex items-center justify-end gap-4 px-4 py-2 border-t border-border">
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    <AtSign className="h-4 w-4" />
                    <span>Mention</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    <Plus className="h-4 w-4" />
                    <span>Add Files</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sensitive Knowledge Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="sensitive-knowledge"
              checked={isSensitive}
              onCheckedChange={(checked) => setIsSensitive(checked as boolean)}
              className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer"
            />
            <label
              htmlFor="sensitive-knowledge"
              className="text-sm text-foreground cursor-pointer select-none"
            >
              Sensitive Knowledge
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent
                  className="bg-background text-foreground border-input shadow-sm max-w-[280px] [&>svg]:hidden"
                  sideOffset={5}
                >
                  <p>When enabled, this knowledge will only be visible to admins and will not be shared with all users</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Footer Divider */}
        <div className="border-t border-border" />

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-full border-input bg-background shadow-none hover:bg-secondary cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
