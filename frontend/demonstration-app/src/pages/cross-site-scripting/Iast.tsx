import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Erklärungsseite: Interactive Application Security Testing (IAST).
 *
 * Erklärt den hybriden Ansatz: Ein Agent läuft innerhalb der laufenden Anwendung
 * und beobachtet den Datenfluss in Echtzeit während Tests ausgeführt werden.
 * Bei XSS erkennt IAST den kompletten Pfad von HTTP-Anfrage bis zur
 * ungefilterten HTML-Ausgabe inklusive Aufrufpfad und Codezeile.
 *
 * Route: `/xss/iast`
 * Verlinkt von {@link XssSchutz}.
 */
export default function Iast() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-8 gap-6">
      <Card className="max-w-xl w-full shadow-md">
        <CardHeader>
          <CardTitle className="font-bold">Interactive Application Security Testing (IAST)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p>
            IAST kombiniert Ansätze aus SAST und DAST: Ein Agent läuft direkt innerhalb der
            laufenden Anwendung und beobachtet den Datenfluss in Echtzeit – während Tests
            ausgeführt werden. So werden Schwachstellen mit genauem Kontext (Codezeile,
            Aufrufpfad) gemeldet.
          </p>
          <p>
            Bei XSS erkennt IAST etwa, wenn ein URL-Parameter den kompletten Weg von der
            HTTP-Anfrage bis zur ungefilterten HTML-Ausgabe durchläuft – inklusive aller
            Zwischenschritte im Anwendungscode.
          </p>
          <div>
            <p className="font-semibold text-muted-foreground mb-1">Bekannte Tools</p>
          </div>
          <p className="text-xs text-muted-foreground">
            unter:{" "}
            <a
              href="https://owasp.org/www-project-devsecops-guideline/latest/02c-Interactive-Application-Security-Testing"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              owasp.org -Interactive-Application-Security-Testing
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
