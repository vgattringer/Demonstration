import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CsrfInfoCard from "@/components/CsrfInfoCard"

export default function CrsfSchutz() {
  return (
    <div className="flex min-h-svh flex-col p-8 gap-6">

      <div className="flex flex-1 gap-4 items-stretch">

        <CsrfInfoCard className="flex-1" />

        <Card className="flex-[2] shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Welche Schutzmöglichkeiten gibt es?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 text-sm">

            {/* ── Als Entwicklerin ──────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <p className="font-semibold">Als Entwicklerin</p>

              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="border border-border p-2 text-left bg-muted font-semibold w-1/3">Maßnahme</th>
                    <th className="border border-border p-2 text-left bg-muted font-semibold">Beschreibung</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "CSRF-Token",
                      "Server generiert ein zufälliges, session-gebundenes Token. Es wird bei jedem zustandsverändernden Request mitgeschickt und serverseitig geprüft. Eine fremde Seite kennt diesen Token nicht und kann ihn nicht fälschen.",
                      null,
                    ],
                    [
                      "SameSite=Strict",
                      "Cookie wird bei allen Cross-Site-Requests blockiert — auch bei Link-Klicks von fremden Seiten. Strikter als Lax, verhindert beide CSRF-Szenarien vollständig.",
                      "strict-tooltip",
                    ],
                    [
                      "SameSite=Lax (mit Vorsicht)",
                      "Schützt vor Cross-Site-POST, -fetch und -img-Requests. Schützt nicht vor Top-Level-GET-Navigation — deshalb dürfen GET-Endpoints niemals Zustand verändern.",
                      null,
                    ],
                    [
                      "Double Submit Cookie",
                      "Token wird sowohl als Cookie als auch im Request-Body gesendet. Der Server vergleicht beide — stimmen sie nicht überein, wird der Request abgelehnt.",
                      null,
                    ],
                    [
                      "Origin/Referer-Header prüfen",
                      "Request wird abgelehnt, wenn der Origin- oder Referer-Header nicht zur eigenen Domain passt. Einfach umzusetzen, aber als alleiniger Schutz nicht ausreichend.",
                      null,
                    ],
                    [
                      "GET nie für Zustandsänderungen",
                      "GET-Endpoints dürfen laut HTTP-Spezifikation keine Daten verändern. Wird das eingehalten, ist der einfachste CSRF-Angriffsvektor (Link-Klick) bereits ausgeschlossen.",
                      null,
                    ],
                  ].map(([measure, description, tooltip]) => (
                    <tr key={measure} className="even:bg-muted/40">
                      <td className="border border-border p-2 font-semibold align-top">
                        {tooltip === "strict-tooltip" ? (
                          <div className="relative group inline-block">
                            <span className="cursor-help underline decoration-dotted underline-offset-2">
                              {measure}
                            </span>
                            <div className="absolute left-0 top-full mt-2 w-96 rounded-md bg-popover border border-border shadow-md px-3 py-2 text-xs text-popover-foreground invisible group-hover:visible z-50 leading-relaxed font-normal">
                              <p className="font-semibold mb-1">⚠ Einschränkungen in der Praxis</p>
                              <p className="mb-1">Wenn ein User auf einen Link zu deiner App klickt — aus einer E-Mail, aus Google, aus einem anderen Tab — schickt der Browser das Session-Cookie <span className="font-medium">nicht</span> mit. Der User landet auf der Seite und ist scheinbar ausgeloggt, obwohl seine Session noch gültig ist.</p>
                              <p className="font-semibold mt-2 mb-1">Szenarien, die kaputt gehen:</p>
                              <ul className="list-disc list-inside flex flex-col gap-0.5 pl-1">
                                <li>Link aus E-Mail-Newsletter → User nicht eingeloggt</li>
                                <li>„Mit Freunden teilen"-Link → kein personalisierter Inhalt</li>
                                <li>OAuth/SSO-Redirect von externem Provider → Login schlägt fehl</li>
                                <li>Zahlungsanbieter (PayPal) redirectet zurück → Session verloren</li>
                              </ul>
                              <p className="font-semibold mt-2 mb-1">Wann sinnvoll?</p>
                              <p>Nur für interne Tools, Admin-Panels oder Banking-Apps, bei denen User immer direkt auf die Domain navigieren.</p>
                              <p className="font-semibold mt-2 mb-1">OWASP-Empfehlung:</p>
                              <p><code className="bg-muted px-0.5 rounded">SameSite=Lax</code> + CSRF-Token kombinieren — solider Schutz ohne UX-Einbußen.</p>
                            </div>
                          </div>
                        ) : (
                          measure
                        )}
                      </td>
                      <td className="border border-border p-2 align-top">{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Sicher vs. Unsicher */}
              <div className="flex flex-col gap-3">

                <div className="flex flex-col gap-1">
                  <div className="relative group w-fit">
                    <p className="text-xs font-semibold text-destructive cursor-help underline decoration-dotted underline-offset-2">
                      ✗ Unsicher – kein CSRF-Token
                    </p>
                    <div className="absolute bottom-full left-0 mb-2 w-80 rounded-md bg-popover border border-border shadow-md px-3 py-2 text-xs text-popover-foreground invisible group-hover:visible z-50 leading-relaxed">
                      <p className="font-semibold mb-1">Warum ist das gefährlich?</p>
                      <p>Der Endpoint vertraut dem Session-Cookie blind. Eine fremde Seite kann einen identischen Request auslösen — der Server kann nicht unterscheiden, ob er vom echten User oder von einem Angreifer ausgelöst wurde.</p>
                    </div>
                  </div>
                  <pre className="bg-muted rounded p-3 text-xs overflow-x-auto whitespace-pre">
{`[HttpDelete("{id:int}")]
public async Task<IActionResult> Delete(int id)
{
    // Kein [ValidateAntiForgeryToken]
    var user = await db.Users.FindAsync(id);
    db.Users.Remove(user);
    await db.SaveChangesAsync();
    return NoContent();
}`}
                  </pre>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="relative group w-fit">
                    <p className="text-xs font-semibold text-green-600 cursor-help underline decoration-dotted underline-offset-2">
                      ✓ Sicher – CSRF-Token-Validierung
                    </p>
                    <div className="absolute bottom-full left-0 mb-2 w-80 rounded-md bg-popover border border-border shadow-md px-3 py-2 text-xs text-popover-foreground invisible group-hover:visible z-50 leading-relaxed">
                      <p className="font-semibold mb-1">Was macht ValidateAntiForgeryToken?</p>
                      <p>ASP.NET Core generiert ein zufälliges Token und bindet es an die Session. Das Attribut prüft bei jedem Request, ob der Token im Request-Header oder -Body vorhanden und gültig ist. Eine fremde Seite kann diesen Token nicht kennen.</p>
                    </div>
                  </div>
                  <pre className="bg-muted rounded p-3 text-xs overflow-x-auto whitespace-pre">
{`[HttpDelete("{id:int}")]
[ValidateAntiForgeryToken]   // ← Token wird geprüft
public async Task<IActionResult> Delete(int id)
{
    var user = await db.Users.FindAsync(id);
    db.Users.Remove(user);
    await db.SaveChangesAsync();
    return NoContent();
}`}
                  </pre>
                </div>

              </div>

              <p className="text-xs text-muted-foreground">
                Quelle:{" "}
                <a
                  href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  cheatsheetseries.owasp.org – CSRF Prevention Cheat Sheet
                </a>
              </p>
            </div>

            <div className="border-t" />

            {/* ── Als Client ────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <p className="font-semibold">Als Client</p>
              <p className="text-muted-foreground text-xs">
                CSRF ist primär ein serverseitiges Problem — die Verantwortung liegt bei der Entwicklerin.
                Als Client gibt es kaum technische Schutzmöglichkeiten; bewusstes Verhalten hilft jedoch,
                das Risiko zu reduzieren.
              </p>

              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="border border-border p-2 text-left bg-muted font-semibold w-1/3">Maßnahme</th>
                    <th className="border border-border p-2 text-left bg-muted font-semibold">Beschreibung</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Nach Nutzung ausloggen",
                      "Kein aktiver Session-Cookie bedeutet kein CSRF-Angriff möglich. Besonders wichtig bei sensiblen Anwendungen (Banking, Admin-Tools).",
                    ],
                    [
                      "Links in E-Mails kritisch prüfen",
                      "Phishing-Mails sind der häufigste Angriffsvektor. Absender-Domain und Linkziel genau prüfen, bevor man klickt.",
                    ],
                    [
                      "Mehrere Tabs/Sessions trennen",
                      "Nicht gleichzeitig in einer sensitiven App eingeloggt sein und fremde Seiten besuchen — insbesondere bei Admin-Oberflächen.",
                    ],
                  ].map(([measure, description]) => (
                    <tr key={measure} className="even:bg-muted/40">
                      <td className="border border-border p-2 font-semibold align-top">{measure}</td>
                      <td className="border border-border p-2 align-top">{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </CardContent>
        </Card>

      </div>

      <Link to="/csrf" className="text-sm underline underline-offset-4">
        ← Zurück zu Cross-Site Request Forgery
      </Link>

    </div>
  )
}
