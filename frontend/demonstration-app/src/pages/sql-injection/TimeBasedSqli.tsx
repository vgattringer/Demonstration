import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Erklärungsseite: Time-based Blind SQL-Injection.
 *
 * Beschreibt das Angriffsprinzip: Der Angreifer nutzt `SLEEP()`-Funktionen,
 * um die Antwortzeit zu verzögern und so Daten Bit für Bit auszulesen —
 * ganz ohne sichtbare Ausgabe in der Antwort.
 *
 * Route: `/sql-injection/time-based`
 * Verlinkt von {@link SqlInjectionInfoCard}.
 */
export default function TimeBasedSqli() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-8 gap-6">
      <Card className="max-w-xl w-full shadow-md">
        <CardHeader>
          <CardTitle className="font-bold">Time-based Blind SQLi</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            Der Angreifer nutzt Datenbankfunktionen wie{" "}
            <code className="bg-muted px-1 rounded">SLEEP()</code>, um die Antwortzeit
            absichtlich zu verzögern — eine lange Antwort bedeutet „wahr", eine schnelle
            „falsch". So lassen sich Daten Bit für Bit auslesen, ohne sichtbare Ausgabe.
          </p>
        </CardContent>
      </Card>
      <Link to="/sql-injection" className="text-sm underline underline-offset-4">
        ← Zurück zu SQL-Injection
      </Link>
    </div>
  )
}
