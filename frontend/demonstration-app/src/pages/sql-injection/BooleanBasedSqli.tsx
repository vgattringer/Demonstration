import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BooleanBasedSqli() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-8 gap-6">
      <Card className="max-w-xl w-full shadow-md">
        <CardHeader>
          <CardTitle className="font-bold">Boolean-based Blind SQLi</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            Der Angreifer stellt der Datenbank Ja/Nein-Fragen (z.B. „Ist der erste
            Buchstabe des Passworts ein A?") und schließt aus dem unterschiedlichen
            Verhalten der Anwendung auf Daten — ohne dass die Datenbank direkt Werte
            zurückgibt.
          </p>
        </CardContent>
      </Card>
      <Link to="/sql-injection" className="text-sm underline underline-offset-4">
        ← Zurück zu SQL-Injection
      </Link>
    </div>
  )
}
