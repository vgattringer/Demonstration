import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dast() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-8 gap-6">
      <Card className="max-w-xl w-full shadow-md">
        <CardHeader>
          <CardTitle className="font-bold">Dynamic Application Security Testing (DAST)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p>
            DAST testet eine laufende Anwendung von außen – ohne Zugriff auf den Quellcode
            (Black-Box-Test). Es simuliert einen echten Angreifer, der HTTP-Requests sendet
            und Antworten auf Schwachstellen analysiert.
          </p>
          <p>
            Für XSS sendet DAST automatisiert präparierte Payloads an Formulare und
            URL-Parameter und prüft, ob der Schadcode in der Antwort ungefiltert zurückgespiegelt
            oder dauerhaft gespeichert wird.
          </p>
          <div>
            <p className="font-semibold text-muted-foreground mb-1">Bekannte Tools</p>
          </div>
          <p className="text-xs text-muted-foreground">
            unter:{" "}
            <a
              href="https://owasp.org/www-community/Vulnerability_Scanning_Tools"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              owasp.org – Vulnerability Scanning Tools
            </a>
          </p>
        </CardContent>
      </Card>
      <Link to="/cross-site-scripting/schutz" className="text-sm underline underline-offset-4">
        ← Zurück zu Schutzmöglichkeiten
      </Link>
    </div>
  )
}
