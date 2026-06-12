import { useState } from "react"

const ATTACK_URL = `https://intranet.firma.at/admin/user/delete?id=42`

const INITIAL_USERS = [
  { id: 40, name: "Anna Berger",   role: "Buchhaltung" },
  { id: 41, name: "Klaus Huber",   role: "IT-Support" },
  { id: 42, name: "Sandra Weiss",  role: "Personalwesen" },
  { id: 43, name: "Markus Gruber", role: "Vertrieb" },
]

export default function GetCsrf() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [deleted, setDeleted] = useState(false)

  function handleLinkClick(e: React.MouseEvent) {
    e.preventDefault()
    setUsers(u => u.filter(user => user.id !== 42))
    setDeleted(true)
  }

  return (
    <div className="flex flex-col gap-3 text-sm">

      {/* Schritt-für-Schritt */}
      <ol className="flex flex-col gap-1 text-sm text-muted-foreground list-decimal list-inside">
        <li>Thomas (Admin) ist den ganzen Arbeitstag im Firmen-Intranet eingeloggt</li>
        <li>
          Das Intranet erlaubt Benutzer-Löschungen per GET:{" "}
          <code className="bg-muted px-1 rounded text-xs break-all">/admin/user/delete?id=42</code>
        </li>
        <li>Angreifer schickt Thomas eine manipulierte Mail mit getarntem Link</li>
        <li>Thomas klickt – Browser sendet Session-Cookie automatisch mit → Benutzer gelöscht</li>
      </ol>

      <div className="flex gap-3">

        {/* Mock Intranet */}
        <div className="flex-1 rounded-md border text-xs overflow-hidden">
          <div className="bg-muted px-3 py-2 border-b font-semibold flex items-center gap-2 min-w-0">
            <span className="text-[10px] bg-green-500 text-white rounded px-1.5 py-0.5 shrink-0">● Eingeloggt</span>
            <span className="truncate text-[11px] leading-tight">intranet.firma</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/40 text-[11px] text-muted-foreground">
                <th className="px-3 py-1.5 text-left font-medium">ID</th>
                <th className="px-3 py-1.5 text-left font-medium">Name</th>
                <th className="px-3 py-1.5 text-left font-medium">Abteilung</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-3 py-1.5 text-muted-foreground">{user.id}</td>
                  <td className="px-3 py-1.5">{user.name}</td>
                  <td className="px-3 py-1.5 text-muted-foreground">{user.role}</td>
                </tr>
              ))}
              {deleted && (
                <tr>
                  <td colSpan={3} className="px-3 py-2 text-center text-destructive text-[11px]">
                    ⚠ Sandra Weiss wurde gelöscht
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mock E-Mail */}
        <div className="flex-1 rounded-md border text-xs overflow-hidden">
          <div className="bg-muted px-3 py-2 flex flex-col gap-0.5 border-b">
            <p><span className="font-semibold">Von:</span> it-support@firma.at.helpdesk-notice.com</p>
            <p><span className="font-semibold">An:</span> thomas.admin@firma.at</p>
            <p><span className="font-semibold">Betreff:</span> ⚠ Sicherheitshinweis – Aktion erforderlich</p>
          </div>
          <div className="px-3 py-3 flex flex-col gap-2 text-foreground">
            <p>Hallo Thomas,</p>
            <p>
              Unser System hat ungewöhnliche Aktivität festgestellt.
              Bitte klicke auf den folgenden Link, um deinen Zugang zu bestätigen:
            </p>
            <a
              href={ATTACK_URL}
              onClick={handleLinkClick}
              className="text-blue-600 underline underline-offset-2 break-all hover:text-blue-800 cursor-pointer"
            >
              Zugang bestätigen →
            </a>
            <p className="text-muted-foreground text-[11px] break-all">{ATTACK_URL}</p>
            <p className="mt-1">Mit freundlichen Grüßen<br />IT-Support</p>
          </div>
        </div>

      </div>

      {/* Reaktion auf Klick */}
      {deleted && (
        <div className="rounded-md bg-destructive/10 border border-destructive px-3 py-2 text-xs text-destructive">
          <span className="font-semibold">⚠ Benutzer gelöscht!</span>
          <span className="font-normal"> Thomas hat nie auf „Löschen" geklickt – der Browser hat den GET-Request mit seinem Session-Cookie automatisch an intranet.firma.at gesendet. Sandra Weiss existiert nicht mehr im System.</span>
        </div>
      )}

      {/* Warum das heute noch funktioniert */}
      <div className="rounded-md bg-muted/60 border px-3 py-2 text-xs flex flex-col gap-1.5">
        <p className="font-semibold">Warum funktioniert das heute noch?</p>
        <p>
          Thomas ist den <span className="font-medium">ganzen Arbeitstag</span> eingeloggt –
          das Timing-Problem entfällt. SameSite=Lax (Browser-Default) blockiert Cookies
          bei Image-Requests, aber <span className="font-medium">nicht bei Link-Klicks</span>:
          Ein {"<a href>"} zählt als Top-Level-Navigation, Cookies werden mitgesendet.
        </p>
        <p>
          Interne Tools und Admin-Panels haben häufig keine CSRF-Tokens, weil sie als
          „ohnehin nicht von außen erreichbar" gelten – ein Trugschluss, solange
          ein eingeloggter Mitarbeiter eine Mail öffnen kann.
        </p>
      </div>

    </div>
  )
}
