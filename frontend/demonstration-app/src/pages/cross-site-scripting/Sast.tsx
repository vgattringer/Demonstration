import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Sast() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-8 gap-6">
      <Card className="max-w-xl w-full shadow-md">
        <CardHeader>
          <CardTitle className="font-bold">Static Application Security Testing (SAST)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p>
            SAST analysiert den Quellcode, Bytecode oder Binärcode einer Anwendung, ohne sie
            auszuführen. Sicherheitslücken werden damit bereits früh im Entwicklungsprozess –
            noch vor dem ersten Build – identifiziert (Shift-Left-Prinzip).
          </p>
          <p>
            Im Kontext von XSS erkennt SAST beispielsweise, wenn Benutzereingaben ungefiltert
            in HTML-Ausgaben fließen oder wenn{" "}
            <code className="bg-muted px-1 rounded">dangerouslySetInnerHTML</code> mit
            unkontrolliertem Input verwendet wird.
          </p>
          <div>
            <p className="font-semibold text-muted-foreground mb-1">Bekannte Tools</p>
          </div>
          <p className="text-xs text-muted-foreground">
            unter:{" "}
            <a
              href="https://owasp.org/www-community/Source_Code_Analysis_Tools"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              owasp.org – Source Code Analysis Tools
            </a>
          </p>
        </CardContent>
      </Card>
      <Link to="/xss/schutz" className="text-sm underline underline-offset-4">
        ← Zurück zu Schutzmöglichkeiten
      </Link>
    </div>
  )
}
