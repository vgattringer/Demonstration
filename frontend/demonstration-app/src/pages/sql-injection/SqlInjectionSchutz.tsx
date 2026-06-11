import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SqlInjectionInfoCard from "@/components/SqlInjectionInfoCard"

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
          <CardContent>
            {/* Inhalt folgt */}
          </CardContent>
        </Card>

      </div>

      <Link to="/sql-injection" className="text-sm underline underline-offset-4">
        ← Zurück zu SQL-Injection
      </Link>
    </div>
  )
}
