import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * Wiederverwendbare Info-Card mit der XSS-Erklärung.
 *
 * Erklärt Begriff, Angriffsprinzip und Auswirkungen (Cookie-/Session-Diebstahl,
 * DOM-Manipulation). Quelle: OWASP XSS Attack Description.
 *
 * Wird verwendet in:
 * - {@link CrossSiteScripting} (Hauptseite)
 * - {@link XssSchutz} (Schutzmaßnahmen-Seite)
 *
 * @param className - Optionale zusätzliche CSS-Klassen (z.B. `"flex-1"` für Layout-Zwecke)
 */
export default function XssInfoCard({ className }: { className?: string }) {
  return (
    <Card className={cn("shadow-md", className)}>
      <CardHeader>
        <CardTitle className="font-bold">Was ist Cross-Site Scripting (XSS)?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <p>
          Cross-Site Scripting (XSS) ist – wie SQL Injection – eine Injection-Angriffstechnik, jedoch richtet sie sich nicht gegen die Datenbank, sondern gegen den Browser des Benutzers. Ein Angreifer schleust schädlichen JavaScript-Code in eine verwundbare Webanwendung ein, der dann im Browser anderer Benutzer ausgeführt wird.
        </p>
        <p>
          Ein Angreifer kann XSS nutzen, um einem ahnungslosen Benutzer ein schädliches Skript zu senden. Der Browser des Endbenutzers hat keine Möglichkeit zu erkennen, dass dem Skript nicht vertraut werden sollte, und führt es aus. Da der Browser davon ausgeht, dass das Skript aus einer vertrauenswürdigen Quelle stammt, kann das schädliche Skript auf alle Cookies, Session-Tokens oder andere sensible Informationen zugreifen, die der Browser gespeichert hat und mit dieser Seite verwendet. Diese Skripte können sogar den Inhalt der HTML-Seite umschreiben.
        </p>
        <p className="text-muted-foreground text-xs">
          Quelle:{' '}
          <a
            href="https://owasp.org/www-community/attacks/xss/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            https://owasp.org/www-community/attacks/xss/
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
