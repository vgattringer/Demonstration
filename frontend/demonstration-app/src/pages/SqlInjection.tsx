import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import SqlInjectionInfoCard from "@/components/SqlInjectionInfoCard"

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

interface UserResponse {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  city: string
  postalCode: string
  dateOfBirth: string
  socialSecurityNumber: string
}

// Entspricht LoginResponse aus dem Backend
interface LoginResponse {
  user: UserResponse
  executedSql: string
}

interface TraceData {
  endpoint: "login" | "login-unsafe"
  request: { username: string; authTan: string }
  status: number
  executedSql: string | null
  response: UserResponse | null
}


// ---------------------------------------------------------------------------
// UserTable — zeigt den gefundenen Datensatz
// ---------------------------------------------------------------------------

function UserTable({ user }: { user: UserResponse }) {
  const rows: [string, string][] = [
    ["ID",                 String(user.id)],
    ["Username",           user.username],
    ["Vorname",            user.firstName],
    ["Nachname",           user.lastName],
    ["E-Mail",             user.email],
    ["Stadt",              user.city],
    ["PLZ",                user.postalCode],
    ["Geburtsdatum",       user.dateOfBirth],
    ["Sozialversicherung", user.socialSecurityNumber],
  ]

  return (
    <table className="w-full text-xs border-collapse mt-4">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label} className="border-b border-border last:border-0">
            <td className="py-1.5 pr-3 font-semibold text-muted-foreground w-1/3">{label}</td>
            <td className="py-1.5">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ---------------------------------------------------------------------------
// CodeTrace — zeigt POST → Controller → Response live
// ---------------------------------------------------------------------------

function TraceBlock({ step, label, children }: {
  step: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-muted-foreground">
        <span className="mr-1">{step}</span>{label}
      </p>
      <pre className="bg-muted rounded p-2 text-xs overflow-x-auto whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  )
}

function Arrow() {
  return <p className="text-center text-muted-foreground text-sm">↓</p>
}

function CodeTrace({ trace }: { trace: TraceData | null }) {
  if (!trace) {
    return (
      <p className="text-xs text-muted-foreground">
        Klicke auf "Anmelden (sicher)" oder "Anmelden (unsicher)", um den Ablauf zu sehen.
      </p>
    )
  }

  const { endpoint, request, status, executedSql, response } = trace
  const isSafe = endpoint === "login"

  const controllerCode = isSafe
    ? `var query = db.Users.Where(u =>
    u.Username == request.Username &&
    u.AuthTan  == request.AuthTan);

var executedSql = query.ToQueryString();
var user = await query.FirstOrDefaultAsync();

if (user is null) return Unauthorized();
return Ok(new LoginResponse(UserResponse.FromEntity(user), executedSql));`
    : `// ⚠️ UNSICHER: String-Interpolation ohne Parametrisierung!
var sql = $"SELECT * FROM Users " +
          $"WHERE Username = '{request.username}' " +
          $"AND AuthTan = '{request.authTan}'";

var users = await db.Users.FromSqlRaw(sql).ToListAsync();
var user = users.FirstOrDefault();

if (user is null) return Unauthorized();
return Ok(new LoginResponse(UserResponse.FromEntity(user), sql));`

  const responseText = response
    ? JSON.stringify(response, null, 2)
    : "(kein Body)"

  return (
    <div className="flex flex-col gap-3 text-xs">
      <TraceBlock step="①" label={`POST /api/auth/${endpoint}`}>
        {JSON.stringify(request, null, 2)}
      </TraceBlock>

      <Arrow />

      <TraceBlock step="②" label="AuthController.cs">
        {controllerCode}
      </TraceBlock>

      <Arrow />

      <TraceBlock step="③" label="Ausgeführtes SQL">
        {executedSql ?? "(nicht verfügbar)"}
      </TraceBlock>

      <Arrow />

      <TraceBlock step="④" label={`Response — ${status} ${status === 200 ? "OK" : "Unauthorized"}`}>
        {responseText}
      </TraceBlock>
    </div>
  )
}

// ---------------------------------------------------------------------------
// LoginForm — übergibt Trace-Daten nach oben via onTrace
// ---------------------------------------------------------------------------

function LoginForm({ onTrace }: { onTrace: (trace: TraceData) => void }) {
  const [username, setUsername] = useState("")
  const [tan, setTan] = useState("")
  const [result, setResult] = useState<UserResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(endpoint: "login" | "login-unsafe") {
    setResult(null)
    setError(null)

    const body = { username, authTan: tan }

    try {
      const res = await fetch(`/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        const data: LoginResponse = await res.json()
        setResult(data.user)
        onTrace({ endpoint, request: body, status: 200, executedSql: data.executedSql, response: data.user })
      } else if (res.status === 401) {
        setError("Ungültige Zugangsdaten.")
        onTrace({ endpoint, request: body, status: 401, executedSql: null, response: null })
      } else {
        setError("Unbekannter Fehler.")
      }
    } catch {
      setError("Verbindung zum Backend fehlgeschlagen.")
    }
  }

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">User Name</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="z.B. anna.gruber"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tan">Authentication TAN</Label>
        <Input
          id="tan"
          value={tan}
          onChange={(e) => setTan(e.target.value)}
          placeholder="z.B. 482910"
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" className="flex-1" onClick={() => handleLogin("login")}>
          Anmelden (sicher)
        </Button>
        <Button type="button" variant="destructive" className="flex-1" onClick={() => handleLogin("login-unsafe")}>
          Anmelden (unsicher)
        </Button>
      </div>

      {error && <p className="text-destructive text-xs">{error}</p>}
      {result && <UserTable user={result} />}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SqlInjection — hält den gemeinsamen Trace-State
// ---------------------------------------------------------------------------

export default function SqlInjection() {
  const [trace, setTrace] = useState<TraceData | null>(null)

  return (
    <div className="flex min-h-svh flex-col p-8 gap-6">

      <div className="flex flex-1 gap-4">

        <SqlInjectionInfoCard className="flex-1" />

        <Card className="flex-1 shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Was passiert bei SQL-Injection?</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm onTrace={setTrace} />
          </CardContent>
        </Card>
        

        <Card className="flex-1 shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Was passiert im Code?</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeTrace trace={trace} />
          </CardContent>
        </Card>

      </div>

      <Link to="/" className="text-sm underline underline-offset-4">
        ← Zurück zur Übersicht
      </Link>

      {/* Fixer Button unten rechts */}
      <Link to="/sql-injection/schutz" className="fixed bottom-6 right-6">
        <Button className="rounded-lg shadow-lg">
          Welche Schutzmöglichkeiten gibt es?
        </Button>
      </Link>
    </div>
  )
}
