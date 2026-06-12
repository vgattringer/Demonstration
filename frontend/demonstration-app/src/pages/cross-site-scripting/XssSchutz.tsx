import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import XssInfoCard from "@/components/XssInfoCard"

export default function XssSchutz() {
  return (
    <div className="flex min-h-svh flex-col p-8 gap-6">

      <div className="flex flex-1 gap-4 items-stretch">

        {/* Linke Card: gleiche Breite wie eine der drei Hauptcards (flex-1) */}
        <XssInfoCard className="flex-1" />

        {/* Rechte Card: doppelt so breit (flex-[2]) */}
        <Card className="flex-[2] shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Welche Schutzmöglichkeiten gibt es?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">

            <p className="font-semibold">Wie würde man XSS in einem Formular vermeiden?</p>

            <p>
              Die Hinzufügung von{" "}
              <Link to="/cross-site-scripting/sast" className="underline underline-offset-2 hover:text-muted-foreground">statischen (SAST)</Link>,{" "}
              <Link to="/cross-site-scripting/dast" className="underline underline-offset-2 hover:text-muted-foreground">dynamischen (DAST)</Link>{" "}
              und{" "}
              <Link to="/cross-site-scripting/iast" className="underline underline-offset-2 hover:text-muted-foreground">interaktiven (IAST)</Link>{" "}
              Application-Security-Testing-Tools in die CI/CD-Pipeline kann dabei helfen,
              Injection-Schwachstellen vor dem Produktivbetrieb zu identifizieren.{" "}
              <a
                href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                owasp
              </a>
            </p>

            <div className="flex flex-col gap-2">
              <p className="font-semibold text-muted-foreground">Konkrete Maßnahmen</p>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="border border-border p-2 text-left bg-muted font-semibold w-1/3">Maßnahme</th>
                    <th className="border border-border p-2 text-left bg-muted font-semibold">Beschreibung</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Output-Encoding", <>Alle Ausgaben HTML-encodieren (<code className="bg-muted px-1 rounded">{"<"}</code> → <code className="bg-muted px-1 rounded">&amp;lt;</code>)</>],
                    ["Content Security Policy (CSP)", "HTTP-Header verhindert Ausführung von externem JS"],
                    ["HttpOnly-Cookies", "Cookies nicht per JavaScript zugreifbar"],
                    ["Whitelist-Validierung", "Nur erlaubte Zeichen/Formate für jedes Eingabefeld"],
                    ["Sichere Frameworks", "React, Angular etc. escapen Ausgaben automatisch"],
                  ].map(([measure, description]) => (
                    <tr key={measure as string} className="even:bg-muted/40">
                      <td className="border border-border p-2 font-semibold align-top">{measure}</td>
                      <td className="border border-border p-2 align-top">{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2">
              <pre className="bg-muted rounded p-3 text-xs overflow-x-auto whitespace-pre">{`<!-- Unsicher -->
<p>Willkommen, <?= $_GET['name'] ?></p>

<!-- Sicher -->
<p>Willkommen, <?= htmlspecialchars($_GET['name'], ENT_QUOTES, 'UTF-8') ?></p>`}</pre>
            </div>

          </CardContent>
        </Card>

      </div>

      <Link to="/xss" className="text-sm underline underline-offset-4">
        ← Zurück zu Cross-Site Scripting
      </Link>
    </div>
  )
}
