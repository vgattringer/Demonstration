import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import XssInfoCard from "@/components/XssInfoCard"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ReflectedXss } from "./cross-site-scripting/ReflectedXss"
import { StoredXss } from "./cross-site-scripting/StoredXss"
import { ReflectedCodeTrace, StoredCodeTrace, ReflectedOutput, StoredOutput } from "./cross-site-scripting/XssCodeTrace"

/**
 * Aktiver Demonstrationsmodus auf der XSS-Seite.
 * - `"reflected"` — Reflected-XSS-Demo
 * - `"stored"`    — Stored-XSS-Demo
 * - `null`        — kein Modus ausgewählt (Initialzustand)
 */
type XssMode = "reflected" | "stored" | null

/**
 * Hauptseite der Cross-Site-Scripting-Demonstration.
 *
 * Dreispaltiges Layout:
 * 1. {@link XssInfoCard} — Theorie-Erklärung
 * 2. Dropdown-Auswahl + interaktive Demo ({@link ReflectedXss} oder {@link StoredXss})
 * 3. Zugehöriger Code-Trace ({@link ReflectedCodeTrace} oder {@link StoredCodeTrace})
 *
 * Hält den gemeinsamen Modus-State und die jeweiligen Output-States;
 * reicht sie als Props an die Sub-Komponenten weiter.
 *
 * @see {@link StoredVsReflectedXss} für den Vergleich beider XSS-Varianten
 * @see {@link XssSchutz} für die Schutzmaßnahmen-Seite
 */
export default function CrossSiteScripting() {
  const [mode, setMode] = useState<XssMode>(null)
  const [reflectedOutput, setReflectedOutput] = useState<ReflectedOutput | null>(null)
  const [storedOutput, setStoredOutput] = useState<StoredOutput | null>(null)

  return (
    <div className="flex min-h-svh flex-col p-8 gap-6">

      <div className="flex flex-1 gap-4">

        <XssInfoCard className="flex-1 shadow-md" />

        <Card className="flex-1 shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Was passiert bei Cross-Site Scripting (XSS)?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {mode === "reflected" ? "XSS Reflected" : mode === "stored" ? "XSS Stored" : "Wähle Demonstration"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>XSS Attacke</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={mode ?? ""} onValueChange={(v) => setMode(v as XssMode)}>
                    <DropdownMenuRadioItem value="reflected">XSS Reflected</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="stored">XSS Stored</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {mode === "reflected" && <ReflectedXss onOutput={setReflectedOutput} />}
            {mode === "stored" && <StoredXss onOutput={setStoredOutput} />}
          </CardContent>
        </Card>

        <Card className="flex-1 shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Was passiert im Code?</CardTitle>
          </CardHeader>
          <CardContent>
            {mode === "reflected" && <ReflectedCodeTrace output={reflectedOutput} />}
            {mode === "stored" && <StoredCodeTrace output={storedOutput} />}
            {mode === null && <p className="text-xs text-muted-foreground">Wähle zuerst eine Demonstration aus.</p>}
          </CardContent>
        </Card>

      </div>

      <Link to="/" className="text-sm underline underline-offset-4">
        ← Zurück zur Übersicht
      </Link>

      {/* Fixer Button unten rechts Card 2 */}
      <Link to="/stored-vs-reflected" className="fixed bottom-6 right-[calc(33.1%+1rem)]">
        <Button className="rounded-lg shadow-lg">
          Stored versus Reflected XSS
        </Button>
      </Link>

      {/* Fixer Button unten rechts Card 3 */}
      <Link to="/xss/schutz" className="fixed bottom-6 right-6">
        <Button className="rounded-lg shadow-lg">
          Welche Schutzmöglichkeiten gibt es?
        </Button>
      </Link>
    
      
    </div>
  )
}
