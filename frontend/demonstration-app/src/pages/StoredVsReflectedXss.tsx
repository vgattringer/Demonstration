import { Link } from "react-router-dom"

export default function StoredVsReflectedXss() {
  return (
    <div className="flex min-h-svh flex-col p-8 gap-6">

      <h1 className="text-3xl font-bold">Stored versus Reflected XSS</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border border-border p-3 text-left bg-muted font-semibold w-1/4">Kriterium</th>
              <th className="border border-border p-3 text-left bg-muted font-semibold">Stored XSS</th>
              <th className="border border-border p-3 text-left bg-muted font-semibold">Reflected XSS</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Wie funktioniert es?",
                "Der Schadcode wird dauerhaft in der Datenbank gespeichert (z.B. in einem Kommentar oder Profil).",
                "Der Schadcode steckt in einer manipulierten URL und wird sofort vom Server zurückgespiegelt."],
              ["Persistenz",
                "Dauerhaft — bleibt bis zur manuellen Bereinigung aktiv.",
                "Einmalig — funktioniert nur beim direkten Aufruf der präparierten URL."],
              ["Wer ist betroffen?",
                "Alle User, die die infizierte Seite aufrufen.",
                "Nur User, die den manipulierten Link anklicken."],
              ["Angriffsvektor",
                "Eingabefeld auf der Website (z.B. Kommentarfeld, Username).",
                "Phishing-Link per E-Mail, Chat oder sozialen Medien."],
              ["Beispiel",
                "<script>stealCookies()</script> als Kommentar gespeichert.",
                "https://example.com/search?q=<script>stealCookies()</script>"],
              ["Gefährlichkeit",
                "Sehr hoch — trifft viele User automatisch.",
                "Mittel — erfordert, dass das Opfer aktiv den Link öffnet."],
              ["Erkennbarkeit",
                "Schwerer zu entdecken — kein auffälliger Link nötig.",
                "Leichter erkennbar — verdächtige URL sichtbar."],
            ].map(([criterion, stored, reflected]) => (
              <tr key={criterion} className="even:bg-muted/40">
                <td className="border border-border p-3 font-semibold text-muted-foreground align-top">{criterion}</td>
                <td className="border border-border p-3 align-top">{stored}</td>
                <td className="border border-border p-3 align-top">{reflected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Für eine Vermeidung von XSS Schwachstellen siehe{" "}
        <a
          href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          cheatsheetseries.owasp.org
        </a>
      </p>

      <Link to="/" className="text-sm underline underline-offset-4">
        ← Zurück zur Übersicht
      </Link>
    </div>
  )
}
