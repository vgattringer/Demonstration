import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CrossSiteRequestForgery() {
  return (
    <div className="flex min-h-svh flex-col p-8 gap-6">

      <div className="flex flex-1 gap-4">

        <Card className="flex-1 shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Was ist Cross-Site Request Forgery (CSRF)?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {/* Inhalt folgt */}
          </CardContent>
        </Card>

        <Card className="flex-1 shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Was passiert bei Cross-Site Request Forgery (CSRF)?</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Inhalt folgt */}
          </CardContent>
        </Card>

        <Card className="flex-1 shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Was passiert im Code?</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Inhalt folgt */}
          </CardContent>
        </Card>

      </div>

      <Link to="/" className="text-sm underline underline-offset-4">
        ← Zurück zur Übersicht
      </Link>
    </div>
  )
}
