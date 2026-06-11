import { Link } from "react-router-dom"

export default function CrossSiteRequestForgery() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Cross-Site Request Forgery (CSRF)</h1>
      <p className="text-muted-foreground">Inhalte folgen...</p>
      <Link to="/" className="text-sm underline underline-offset-4">
        ← Zurück zur Übersicht
      </Link>
    </div>
  )
}
