import React from "react"

/**
 * Visueller Trennpfeil zwischen zwei {@link TraceBlock}-Elementen.
 *
 * Rendert ein zentriertes „↓"-Symbol in gedämpfter Schriftfarbe,
 * um den Datenfluss innerhalb eines Code-Traces darzustellen.
 */
export function Arrow() {
  return <p className="text-center text-muted-foreground text-sm">↓</p>
}

/**
 * Einzelner Schritt in einem Code-Trace.
 *
 * Zeigt eine nummerierte Überschrift (Schritt + Label) und darunter
 * den zugehörigen Code oder Dateninhalt in einem `<pre>`-Block.
 *
 * @param step     - Schrittnummer als Symbol oder Text, z.B. `"①"` oder `"1."`
 * @param label    - Kurzbeschreibung des Schritts, z.B. `"POST /api/auth/login"`
 * @param children - Anzuzeigender Inhalt (meistens ein Code-String oder JSON)
 *
 * @example
 * ```tsx
 * <TraceBlock step="①" label="POST /api/auth/login">
 *   {JSON.stringify(request, null, 2)}
 * </TraceBlock>
 * ```
 */
export function TraceBlock({
  step,
  label,
  children,
}: {
  step: string
  label: string
  children: React.ReactNode
}) {
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
