import { Arrow, TraceBlock } from "@/components/CodeTrace"

/**
 * DTO für einen Benutzer-Datensatz aus der Backend-Antwort.
 *
 * Entspricht dem `UserResponse`-Record im C#-Backend (`AuthController`).
 * Enthält bewusst sensible Felder (SVN, Geburtsdatum), um den Schaden
 * einer erfolgreichen SQL-Injection zu demonstrieren.
 */
export interface UserResponse {
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

/**
 * Daten eines einzelnen Login-Versuchs für die Code-Trace-Anzeige.
 *
 * Wird von {@link LoginForm} befüllt und an {@link SqlInjCodeTrace} weitergegeben.
 */
export interface TraceData {
  /** Verwendeter Endpunkt: `"login"` (sicher) oder `"login-unsafe"` (unsicher). */
  endpoint: "login" | "login-unsafe"
  /** Gesendete Anmeldedaten. */
  request: { username: string; authTan: string }
  /** HTTP-Statuscode der Backend-Antwort (200 oder 401). */
  status: number
  /** Das tatsächlich ausgeführte SQL-Statement; `null` bei Fehler. */
  executedSql: string | null
  /** Zurückgegebener Benutzer; `null` bei fehlgeschlagenem Login. */
  response: UserResponse | null
}

/**
 * Code-Trace-Komponente für die SQL-Injection-Demonstration.
 *
 * Visualisiert den vollständigen Request-Response-Zyklus in vier Schritten:
 * `POST`-Request → `AuthController.cs`-Code → ausgeführtes SQL → HTTP-Response.
 *
 * Zeigt je nach Endpunkt den sicheren (parametrisierten) oder unsicheren
 * (string-interpolierten) C#-Controller-Code an.
 *
 * @param trace - Trace-Daten des letzten Login-Versuchs; `null` zeigt Platzhalter-Text.
 */
export function SqlInjCodeTrace({ trace }: { trace: TraceData | null }) {
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
