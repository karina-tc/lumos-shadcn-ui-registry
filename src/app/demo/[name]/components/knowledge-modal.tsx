"use client"

import { useState } from "react"
import { KnowledgeModal } from "@/components/knowledge-modal"
import { Button } from "@/components/ui/button"

function KnowledgeModalDemo() {
  const [open, setOpen] = useState(true)

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[600px] bg-muted/40 rounded-lg p-8">
      <Button onClick={() => setOpen(true)} className="rounded-full">
        Add Knowledge
      </Button>
      <KnowledgeModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(data) => {
          console.log("Saved:", data)
          setOpen(false)
        }}
      />
    </div>
  )
}

export const knowledgeModal = {
  name: "knowledge-modal",
  components: {
    Default: <KnowledgeModalDemo />,
  },
}
