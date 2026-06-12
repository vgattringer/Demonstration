import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Arrow, TraceBlock, XSS_PAYLOAD, ReflectedOutput } from "./shared"

// ---------------------------------------------------------------------------
// ReflectedXss
// ---------------------------------------------------------------------------

export function ReflectedXss({ onOutput }: { onOutput: (o: ReflectedOutput) => void }) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<ReflectedOutput | null>(null)
  const [xssTriggered, setXssTriggered] = useState(false)

  useEffect(() => {
    const handler = () => setXssTriggered(true)
    document.addEventListener("xss-triggered", handler)
    return () => document.removeEventListener("xss-triggered", handler)
  }, [])

  function handle(safe: boolean) {
    setXssTriggered(false)
    const o = { value: input, safe }
    setOutput(o)
    onOutput(o)
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      <p className="text-sm text-muted-foreground">
        Als Angreifer besuche ich eine vertrauenswürdige Seite und gebe im Kommentarbereich folgenden Code ein:
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="xss-input">Kommentar eingeben</Label>
          <button
            type="button"
            onClick={() => setInput(XSS_PAYLOAD)}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Payload einfügen
          </button>
        </div>
        <Input id="xss-input" value={input} readOnly placeholder={XSS_PAYLOAD} />
      </div>

      <div className="flex gap-2">
        <Button type="button" className="flex-1" onClick={() => handle(true)}>
          Sicher rendern
        </Button>
        <Button type="button" variant="destructive" className="flex-1" onClick={() => handle(false)}>
          Unsicher rendern
        </Button>
      </div>

      {xssTriggered && (
        <div className="rounded-md bg-destructive/10 border border-destructive px-3 py-2 text-xs font-semibold text-destructive">
          ⚠ XSS erfolgreich! Schadcode wurde ausgeführt.
        </div>
      )}

      {output && (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-muted-foreground">Ausgabe:</p>
          <div className="rounded-md border bg-muted p-3 text-sm min-h-[2.5rem]">
            {output.safe
              // ✅ SICHER: React escaped den Input – wird als plain text gerendert
              ? <span>{output.value}</span>
              // ⚠️ UNSICHER: dangerouslySetInnerHTML umgeht Reacts Schutz – HTML wird ausgeführt
              : <span dangerouslySetInnerHTML={{ __html: output.value }} />
            }
          </div>
          <p className={`text-xs ${output.safe ? "text-green-600" : "text-destructive"}`}>
            {output.safe
              ? "✓ Sicher: React escaped den Input automatisch."
              : "⚠ Unsicher: dangerouslySetInnerHTML rendert den Input als HTML – eingebettetes JavaScript wird ausgeführt."}
          </p>
        </div>
      )}

      {output && (
        <p className="text-xs text-muted-foreground">
          {output.safe ? (
            <>
              <code className="bg-muted px-1 rounded">{XSS_PAYLOAD}</code>{' '}
              wird von React als einfacher Text behandelt und nicht als HTML interpretiert.
              Das <code className="bg-muted px-1 rounded">onerror</code>-Event wird nie ausgelöst –
              der Schadcode bleibt wirkungslos.
            </>
          ) : (
            <>
              <code className="bg-muted px-1 rounded">{XSS_PAYLOAD}</code>{' '}
              versucht ein Bild mit der ungültigen Quelle <code className="bg-muted px-1 rounded">x</code> zu laden.
              Da das Laden fehlschlägt, feuert der Browser das <code className="bg-muted px-1 rounded">onerror</code>-Event
              und führt den darin enthaltenen JavaScript-Code aus.
              In einem echten Angriff würde hier z.B. der Session-Cookie des Opfers gestohlen.
            </>
          )}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ReflectedCodeTrace
// ---------------------------------------------------------------------------

export function ReflectedCodeTrace({ output }: { output: ReflectedOutput | null }) {
  if (!output) {
    return (
      <p className="text-xs text-muted-foreground">
        Klicke auf „Sicher rendern" oder „Unsicher rendern", um den Code-Ablauf zu sehen.
      </p>
    )
  }

  const safeCode = `// ✓ SICHER: React escaped automatisch
// JSX behandelt den Wert als Text, nicht als HTML
<span>{userInput}</span>

// Gerendert im DOM:
// <span>&lt;img src=x onerror="document.dispatchEvent(...)"&gt;</span>`

  const unsafeCode = `// ⚠ UNSICHER: dangerouslySetInnerHTML
// React umgeht seinen eigenen Escape-Mechanismus
<span dangerouslySetInnerHTML={{ __html: userInput }} />

// Gerendert im DOM:
// <span><img src=x onerror="document.dispatchEvent(...)"></span>
// → onerror feuert → CustomEvent "xss-triggered" wird ausgelöst`

  return (
    <div className="flex flex-col gap-3 text-xs">
      <TraceBlock step="①" label="User-Input">
        {output.value}
      </TraceBlock>

      <Arrow />

      <TraceBlock step="②" label={output.safe ? "React JSX (sicher)" : "dangerouslySetInnerHTML (unsicher)"}>
        {output.safe ? safeCode : unsafeCode}
      </TraceBlock>

      <Arrow />

      <TraceBlock step="③" label={output.safe ? "Browser rendert Text" : "Browser führt Script aus"}>
        {output.safe
          ? `→ Payload wird als plain text angezeigt.\n   Kein Event feuert. Kein Schaden.`
          : `→ <img> wird in den DOM eingefügt.\n   src="x" schlägt fehl → onerror feuert.\n   CustomEvent "xss-triggered" wird dispatched.\n   React Banner: "⚠ XSS erfolgreich!"`
        }
      </TraceBlock>
    </div>
  )
}
