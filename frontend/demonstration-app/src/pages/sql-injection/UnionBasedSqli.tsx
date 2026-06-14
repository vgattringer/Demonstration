import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Erklärungsseite: Union-based SQL-Injection.
 *
 * Beschreibt das Angriffsprinzip: Der Angreifer hängt via `UNION SELECT`
 * eine eigene Abfrage an die originale an und erhält so direkt Daten
 * aus beliebigen Tabellen in der HTTP-Antwort.
 *
 * Route: `/sql-injection/union-based`
 * Verlinkt von {@link SqlInjectionInfoCard}.
 */
export default function UnionBasedSqli() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-8 gap-6">
      <Card className="max-w-xl w-full shadow-md">
        <CardHeader>
          <CardTitle className="font-bold">Union-based SQLi</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            Mit dem SQL-Schlüsselwort <code className="bg-muted px-1 rounded">UNION</code> hängt
            der Angreifer eine eigene <code className="bg-muted px-1 rounded">SELECT</code>-Abfrage
            an die originale an und lässt sich so direkt Daten aus anderen Tabellen in der
            HTTP-Antwort ausgeben.
          </p>
        </CardContent>
      </Card>
      <Link to="/sql-injection" className="text-sm underline underline-offset-4">
        ← Zurück zu SQL-Injection
      </Link>
    </div>
  )
}
