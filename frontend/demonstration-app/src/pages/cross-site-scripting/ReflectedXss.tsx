import { useState, useEffect } from "react"
import { XSS_PAYLOAD, DISPLAY_URL, ReflectedOutput } from "./XssCodeTrace"

const ATTACK_URL = `https://seite.at/suche?q=${XSS_PAYLOAD}`

// ---------------------------------------------------------------------------
// ReflectedXss
// ---------------------------------------------------------------------------

/**
 * Interaktive Reflected-XSS-Demonstration.
 *
 * Zeigt eine simulierte Phishing-E-Mail mit einem präparierten Link.
 * Wenn das Opfer den Link anklickt, wird der XSS-Payload
 * via `dangerouslySetInnerHTML` in den DOM gerendert, was den `onerror`-Handler
 * des `<img>`-Tags auslöst. Das daraus resultierende `xss-triggered`-Event
 * wird abgehört und löst den XSS-Warnbanner aus.
 *
 * @param onOutput - Callback bei Link-Klick; gibt den Payload und `safe: false` weiter.
 *
 * @remarks
 * Der eigentliche Schadcode wird in einem versteckten `<div>` via
 * `dangerouslySetInnerHTML` gerendert — das ist die absichtliche Sicherheitslücke.
 */
export function ReflectedXss({ onOutput }: { onOutput: (o: ReflectedOutput) => void }) {
  const [clicked, setClicked] = useState(false)
  const [xssTriggered, setXssTriggered] = useState(false)

  useEffect(() => {
    const handler = () => setXssTriggered(true)
    document.addEventListener("xss-triggered", handler)
    return () => document.removeEventListener("xss-triggered", handler)
  }, [])

  /**
   * Behandelt den Klick auf den Phishing-Link in der simulierten E-Mail.
   *
   * Verhindert die echte Navigation, setzt `clicked` auf `true` (löst
   * `dangerouslySetInnerHTML` aus) und informiert den Parent über den Output.
   *
   * @param e - React-Maus-Event des Anchor-Tags
   */
  function handleLinkClick(e: React.MouseEvent) {
    e.preventDefault()
    setClicked(true)
    onOutput({ value: XSS_PAYLOAD, safe: false })
  }

  return (
    <div className="flex flex-col gap-3 text-sm">

      {/* 4-Schritt-Erklärung */}
      <ol className="flex flex-col gap-1 text-sm text-muted-foreground list-decimal list-inside">
        <li>
          Angreifer baut eine manipulierte URL:{" "}
          <code className="bg-muted px-1 rounded text-xs break-all">{DISPLAY_URL}</code>
        </li>
        <li>Opfer klickt diesen Link (z.B. aus einer Phishing-Mail)</li>
        <li>Der Server/die Seite liest den URL-Parameter und rendert ihn zurück („reflects")</li>
        <li>Das Skript führt sich im Browser des Opfers aus</li>
      </ol>

      {/* Mock-E-Mail */}
      <div className="rounded-md border text-xs overflow-hidden">
        <div className="bg-muted px-3 py-2 flex flex-col gap-0.5 border-b">
          <p><span className="font-semibold">Von:</span> support@seite.at.evil.com</p>
          <p><span className="font-semibold">An:</span> opfer@beispiel.at</p>
          <p><span className="font-semibold">Betreff:</span> ⚠ Ihr Konto wurde gesperrt – sofort handeln</p>
        </div>
        <div className="px-3 py-3 flex flex-col gap-2 text-foreground">
          <p>Hallo,</p>
          <p>
            Ihr Konto auf <span className="font-medium">seite.at</span> wurde aus
            Sicherheitsgründen vorübergehend gesperrt. Bitte klicken Sie auf den folgenden
            Link, um Ihr Konto sofort wiederherzustellen:
          </p>
          <a
            href={ATTACK_URL}
            onClick={handleLinkClick}
            className="text-blue-600 underline underline-offset-2 break-all hover:text-blue-800 cursor-pointer"
          >
            Jetzt Konto wiederherstellen →
          </a>
          <p className="text-muted-foreground text-[11px] break-all">{ATTACK_URL}</p>
          <p className="mt-1">Mit freundlichen Grüßen<br />Support-Team seite.at</p>
        </div>
      </div>

      {/* XSS Banner */}
      {xssTriggered && (
        <div className="rounded-md bg-destructive/10 border border-destructive px-3 py-2 text-xs text-destructive">
          <span className="font-semibold">⚠ XSS erfolgreich! Schadcode wurde ausgeführt.</span>
          <span className="font-normal"> Ein echter Angreifer könnte damit Session-Cookies stehlen, Tastatureingaben mitschneiden oder den Nutzer auf eine gefälschte Login-Seite umleiten.</span>
        </div>
      )}

      {/* ⚠️ UNSICHER: Payload aus URL wird als HTML gerendert – Reflected XSS */}
      {clicked && (
        <div className="hidden" dangerouslySetInnerHTML={{ __html: XSS_PAYLOAD }} />
      )}
    </div>
  )
}

