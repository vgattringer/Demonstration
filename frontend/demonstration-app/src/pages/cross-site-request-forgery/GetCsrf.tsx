import { useState } from "react"
import { Button } from "@/components/ui/button"

const ATTACK_URL  = `https://app.firma.at/account/settings?email=maria%40evil.com`
const ALICE_EMAIL = "alice@firma.at"
const MARIA_EMAIL = "maria@evil.com"

export default function GetCsrf() {
  const [emailChanged, setEmailChanged] = useState(false)
  const [takenOver,    setTakenOver]    = useState(false)

  function handleLinkClick(e: React.MouseEvent) {
    e.preventDefault()
    setEmailChanged(true)
  }

  return (
    <div className="flex flex-col gap-3 text-sm">

      {/* Schritt-für-Schritt */}
      <ol className="flex flex-col gap-1 text-sm text-muted-foreground list-decimal list-inside">
        <li>Alice ist in ihrem Account auf <code className="bg-muted px-1 rounded text-xs">app.firma.at</code> eingeloggt</li>
        <li>
          Die App erlaubt E-Mail-Änderungen per GET:{" "}
          <code className="bg-muted px-1 rounded text-xs break-all">/account/settings?email=...</code>
        </li>
        <li>Maria schickt Alice eine getarnte Mail – der Link ruft den Endpunkt mit Marias E-Mail auf</li>
        <li>Alice klickt → Browser sendet Session-Cookie mit → E-Mail lautlos geändert</li>
        <li>Maria fordert Passwort-Reset für Alices Account an → Reset-Link landet in Marias Postfach</li>
        <li>Maria setzt neues Passwort → vollständige Account-Übernahme</li>
      </ol>

      {/* Phase 1 */}
      <div className="flex gap-3">

        {/* Mock Account-Einstellungen */}
        <div className="flex-1 rounded-md border text-xs overflow-hidden">
          <div className="bg-muted px-3 py-2 border-b font-semibold flex items-center gap-2 min-w-0">
            <span className="text-[10px] bg-green-500 text-white rounded px-1.5 py-0.5 shrink-0">● Eingeloggt</span>
            <span className="truncate text-[11px]">app.firma.at – Account-Einstellungen</span>
          </div>
          <div className="px-3 py-3 flex flex-col gap-2">
            <p className="text-muted-foreground text-[11px]">Benutzername: alice_w</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-muted-foreground text-[11px] shrink-0">E-Mail:</span>
              <span className={`text-[11px] font-medium transition-colors break-all ${emailChanged ? "text-destructive" : ""}`}>
                {emailChanged ? MARIA_EMAIL : ALICE_EMAIL}
              </span>
              {emailChanged && (
                <span className="text-[10px] bg-destructive/10 text-destructive border border-destructive rounded px-1 shrink-0">
                  geändert
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-[11px]">Passwort: ••••••••</p>
          </div>
        </div>

        {/* Mock Phishing-Mail */}
        <div className="flex-1 rounded-md border text-xs overflow-hidden">
          <div className="bg-muted px-3 py-2 flex flex-col gap-0.5 border-b">
            <p><span className="font-semibold">Von:</span> no-reply@firma.at.account-notice.com</p>
            <p><span className="font-semibold">An:</span> alice@firma.at</p>
            <p><span className="font-semibold">Betreff:</span> Dein Account – Bestätigung erforderlich</p>
          </div>
          <div className="px-3 py-3 flex flex-col gap-2 text-foreground">
            <p>Hallo Alice,</p>
            <p>bitte bestätige deine Account-Daten über folgenden Link:</p>
            <a
              href={ATTACK_URL}
              onClick={handleLinkClick}
              className="text-blue-600 underline underline-offset-2 break-all hover:text-blue-800 cursor-pointer"
            >
              Account bestätigen →
            </a>
            <p className="text-muted-foreground text-[11px] break-all">{ATTACK_URL}</p>
            <p className="mt-1">Mit freundlichen Grüßen<br />app.firma.at</p>
          </div>
        </div>

      </div>

      {/* Phase 2 – erscheint nach E-Mail-Änderung */}
      {emailChanged && !takenOver && (
        <div className="flex flex-col gap-2">
          <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
            <span className="font-semibold">Phase 1 abgeschlossen:</span>
            <span> Alices E-Mail-Adresse wurde lautlos auf <code>{MARIA_EMAIL}</code> geändert. Alice wurde nicht informiert.</span>
          </div>
          <div className="rounded-md border text-xs overflow-hidden">
            <div className="bg-muted px-3 py-2 border-b font-semibold text-[11px]">
              app.firma.at – Passwort vergessen
            </div>
            <div className="px-3 py-3 flex flex-col gap-2">
              <p className="text-muted-foreground">Maria öffnet die Passwort-vergessen-Seite und gibt Alices Benutzernamen ein:</p>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-[11px]">alice_w</code>
                <Button size="sm" className="h-6 text-[11px] px-2" onClick={() => setTakenOver(true)}>
                  Reset anfordern
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2 Ergebnis */}
      {takenOver && (
        <div className="flex flex-col gap-2">
          <div className="rounded-md border text-xs overflow-hidden">
            <div className="bg-muted px-3 py-2 border-b font-semibold flex items-center gap-2 min-w-0">
              <span className="text-[10px] bg-green-500 text-white rounded px-1.5 py-0.5 shrink-0">● Postfach</span>
              <span className="truncate text-[11px]">maria@evil.com – Eingang</span>
            </div>
            <div className="px-3 py-3 flex flex-col gap-1.5">
              <p><span className="font-semibold">Von:</span> no-reply@app.firma.at</p>
              <p><span className="font-semibold">Betreff:</span> Passwort zurücksetzen – app.firma.at</p>
              <p className="text-muted-foreground mt-1">
                Klicke hier, um das Passwort für <strong>alice_w</strong> zurückzusetzen:
              </p>
              <span className="text-blue-600 underline underline-offset-2">
                https://app.firma.at/reset?token=a9f3c2e1... →
              </span>
            </div>
          </div>
          <div className="rounded-md bg-destructive/10 border border-destructive px-3 py-2 text-xs text-destructive">
            <span className="font-semibold">⚠ Account übernommen!</span>
            <span className="font-normal"> Maria setzt ein neues Passwort. Alice ist ausgesperrt – ohne dass sie je auf „E-Mail ändern" oder „Passwort zurücksetzen" geklickt hat.</span>
          </div>
        </div>
      )}

      {/* Warum das heute noch funktioniert */}
      <div className="rounded-md bg-muted/60 border px-3 py-2 text-xs flex flex-col gap-1.5">
        <p className="font-semibold">Warum funktioniert das heute noch?</p>
        <p>
          Ein Link-Klick gilt als Top-Level-Navigation – SameSite=Lax sendet Cookies bei GET-Requests mit.
          Der Angriff braucht keine Malicious Page und kein JavaScript: ein einziger Link reicht.
          Besonders gefährlich, weil Alice den Angriff erst bemerkt, wenn sie sich nicht mehr einloggen kann.
        </p>
      </div>

    </div>
  )
}
