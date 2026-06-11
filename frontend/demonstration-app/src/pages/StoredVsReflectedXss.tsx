import { Link } from "react-router-dom"

export default function StoredVsReflectedXss() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Stored versus Reflected XSS</h1>
      <p className="text-muted-foreground">Inhalte folgen...</p>
      <Link to="/" className="text-sm underline underline-offset-4">
        ← Zurück zur Übersicht
      </Link>
    </div>
  )
}
