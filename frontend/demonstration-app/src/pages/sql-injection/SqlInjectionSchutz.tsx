import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SqlInjectionInfoCard from "@/components/SqlInjectionInfoCard"

/**
 * Schutzmaßnahmen-Seite für SQL-Injection.
 *
 * Erklärt die drei OWASP-empfohlenen Verteidigungsoptionen:
 * 1. Prepared Statements (Parameterized Queries)
 * 2. Stored Procedures
 * 3. Allow-list Input Validation
 *
 * Quelle: OWASP SQL Injection Prevention Cheat Sheet.
 * Route: `/sql-injection/schutz`
 *
 * @see {@link SqlInjection} für die interaktive Demonstrations-Seite
 */
export default function SqlInjectionSchutz() {
  return (
    <div className="flex min-h-svh flex-col p-8 gap-6">

      <div className="flex flex-1 gap-4 items-stretch">

        {/* Linke Card: gleiche Breite wie eine der drei Hauptcards (flex-1) */}
        <SqlInjectionInfoCard className="flex-1" />

        {/* Rechte Card: doppelt so breit (flex-[2]) */}
        <Card className="flex-[2] shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Welche Schutzmöglichkeiten gibt es?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-2">
              <p className="font-semibold">
                Defense Option 1: Prepared Statements (Parameterized Queries)
              </p>
              <p className="font-semibold text-muted-foreground">Kernidee</p>
              <p>
                Der SQL-Code wird zuerst vollständig definiert, und Benutzereingaben werden erst
                danach als Parameter übergeben – niemals per String-Konkatenation. Dadurch trennt
                die Datenbank strikt zwischen Code und Daten, egal was der User eingibt.
              </p>
              <p>
                Ein Angreifer, der z. B.{" "}
                <code className="bg-muted px-1 rounded">tom' OR '1'='1</code> eingibt, würde
                diesen String nur als literalen Suchwert behandelt bekommen – nicht als
                ausführbaren SQL-Code.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">
                Defense Option 2: Stored Procedures
              </p>
              <p>
                Obwohl Stored Procedures nicht immer sicher gegen SQL-Injection sind, können
                Entwickler bestimmte standardisierte Programmierkonstrukte für gespeicherte
                Prozeduren verwenden. Dieser Ansatz hat denselben Effekt wie die Verwendung
                parametrisierter Abfragen – vorausgesetzt, die Stored Procedures werden sicher
                implementiert, was bei den meisten Stored-Procedure-Sprachen der Standard ist.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">Defense Option 3: Allow-list Input Validation</p>
              <p className="font-semibold text-muted-foreground">Das Problem</p>
              <p>
                Parameterized Queries (Option 1) funktionieren hervorragend für Werte wie Namen,
                IDs oder Passwörter. Aber es gibt SQL-Bestandteile, die sich technisch nicht
                parametrisieren lassen:
              </p>
              <ul className="list-disc list-inside flex flex-col gap-1 pl-2">
                <li>Tabellennamen (<code className="bg-muted px-1 rounded">FROM fooTable</code>)</li>
                <li>Spaltennamen (<code className="bg-muted px-1 rounded">ORDER BY salary</code>)</li>
                <li>Sortierrichtungen (<code className="bg-muted px-1 rounded">ASC</code> / <code className="bg-muted px-1 rounded">DESC</code>)</li>
              </ul>
              <p>
                Wenn ein User z. B. eine Spalte zum Sortieren auswählen kann, landet dieser Wert
                direkt im SQL-String – und wäre ohne Schutz ein Einfallstor für Injection.
              </p>
              <p className="font-semibold text-muted-foreground">Die Lösung: Allow-list (Positivliste)</p>
              <p>
                Statt den User-Input direkt zu verwenden, pflegst du eine feste Liste erlaubter
                Werte im Code. Der User-Input wird nur genutzt, um einen sicheren, vordefinierten
                Wert auszuwählen – niemals direkt in die Query eingebaut.
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Diese 3 Optionen stammen von{" "}
              <a
                href="https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                cheatsheetseries.owasp.org
              </a>
            </p>
          </CardContent>
        </Card>

      </div>

      <Link to="/sql-injection" className="text-sm underline underline-offset-4">
        ← Zurück zu SQL-Injection
      </Link>
    </div>
  )
}
