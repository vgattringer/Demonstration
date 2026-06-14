import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * Wiederverwendbare Info-Card mit der CSRF-Erklärung.
 *
 * Erklärt Begriff, Funktionsweise und Abgrenzung zu SQL-Injection/XSS.
 * Quelle: OWASP Cross-Site Request Forgery Prevention Cheat Sheet.
 *
 * Wird verwendet in:
 * - {@link CrossSiteRequestForgery} (Hauptseite)
 * - {@link CrsfSchutz} (Schutzmaßnahmen-Seite)
 *
 * @param className - Optionale zusätzliche CSS-Klassen (z.B. `"flex-1"` für Layout-Zwecke)
 */
export default function CsrfInfoCard({ className }: { className?: string }) {
  return (
    <Card className={cn("shadow-md", className)}>
      <CardHeader>
        <CardTitle className="font-bold">Was ist Cross-Site Request Forgery (CSRF)?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <p>
          Ein CSRF-Angriff tritt auf, wenn eine bösartige Website, E-Mail oder ein Programm den Browser
          eines authentifizierten Benutzers dazu bringt, eine unerwünschte Aktion auf einer vertrauenswürdigen
          Seite auszuführen. Da Browser bei jeder Anfrage automatisch alle Cookies – einschließlich
          Session-Cookies – mitsenden, kann die Zielseite legitime von gefälschten Anfragen nicht
          unterscheiden. So führt das Opfer unwissentlich Aktionen aus, die vom Angreifer vorgegeben
          werden – etwa Passwortänderungen, Überweisungen oder Rechteerweiterungen.
        </p>
        <p>
          Im Unterschied zu SQL-Injection, die auf die Datenbank zielt, und XSS, das schädlichen Code
          im Browser des Opfers ausführt, nutzt CSRF keine Schwachstelle in der Anwendung selbst aus –
          sondern das Vertrauen, das der Server in den bereits authentifizierten Browser des Opfers hat.
          Der Angreifer schleust keinen Code ein; er missbraucht eine echte, gültige Session.
        </p>
        <p className="text-muted-foreground text-xs">
          Quelle:{' '}
          <a
            href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
