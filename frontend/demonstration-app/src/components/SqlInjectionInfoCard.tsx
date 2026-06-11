import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function InlineLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="underline underline-offset-2 hover:text-muted-foreground">
      {children}
    </Link>
  )
}

/// Wiederverwendbare Card mit dem "Was ist SQL-Injection?"-Inhalt.
/// Wird sowohl in SqlInjection.tsx als auch in SqlInjectionSchutz.tsx verwendet.
export default function SqlInjectionInfoCard({ className }: { className?: string }) {
  return (
    <Card className={cn("shadow-md", className)}>
      <CardHeader>
        <CardTitle className="font-bold">Was ist SQL-Injection?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <p>
          Eine SQL-Injection (SQLi) ist ein Angriff, bei dem ein Angreifer bösartige
          SQL-Befehle in Nutzereingaben einschleust, die von der Anwendung ungeprüft
          in Datenbankabfragen eingebaut werden.
        </p>
        <div>
          <p className="font-semibold mb-1">Funktionsweise:</p>
          <p>Eine unsichere Login-Abfrage könnte so aussehen:</p>
          <pre className="bg-muted rounded p-2 mt-1 text-xs overflow-x-auto">
            {"SELECT * FROM users WHERE username = '$user' AND password = '$pass';"}
          </pre>
          <p className="mt-2">
            Gibt der Angreifer als Passwort <code className="bg-muted px-1 rounded">' OR '1'='1</code> ein,
            wird die Abfrage zu:
          </p>
          <pre className="bg-muted rounded p-2 mt-1 text-xs overflow-x-auto">
            {"SELECT * FROM users WHERE username = $user' AND password = '' OR '1'='1';"}
          </pre>
          <p className="mt-2">
            Da <code className="bg-muted px-1 rounded">'1'='1'</code> immer wahr ist, wird der Login umgangen.
          </p>
        </div>
        <p>
          Zu den verbreiteten Varianten zählen{" "}
          <InlineLink to="/sql-injection/boolean-based">Boolean-based Blind SQLi</InlineLink>,{" "}
          <InlineLink to="/sql-injection/union-based">Union-based SQLi</InlineLink> sowie{" "}
          <InlineLink to="/sql-injection/time-based">Time-based Blind SQLi</InlineLink>.
        </p>
        <p>
          Folgen können Datendiebstahl, Authentifizierungsumgehung oder vollständige
          Datenbankmanipulation sein.
        </p>
      </CardContent>
    </Card>
  )
}
