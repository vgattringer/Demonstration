import React from "react"

// ---------------------------------------------------------------------------
// Payload
// ---------------------------------------------------------------------------

export const XSS_PAYLOAD = `<img src=x onerror="document.dispatchEvent(new CustomEvent('xss-triggered'))">`

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface ReflectedOutput {
  value: string
  safe: boolean
}

export interface StoredComment {
  id: number
  content: string
  createdAt: string
}

export interface StoredOutput {
  attackerSafe: boolean
  attackerComment: string
  userSafe?: boolean
  userEntries?: StoredComment[]
}

// ---------------------------------------------------------------------------
// Shared UI Components
// ---------------------------------------------------------------------------

export function Arrow() {
  return <p className="text-center text-muted-foreground text-sm">↓</p>
}

export function TraceBlock({ step, label, children }: { step: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-muted-foreground">
        <span className="mr-1">{step}</span>{label}
      </p>
      <pre className="bg-muted rounded p-2 text-xs overflow-x-auto whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  )
}
