import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ReflectedXss, ReflectedCodeTrace } from "./cross-site-scripting/ReflectedXss"
import { StoredXss, StoredCodeTrace } from "./cross-site-scripting/StoredXss"
import { ReflectedOutput, StoredOutput } from "./cross-site-scripting/shared"

type XssMode = "reflected" | "stored" | null

export default function CrossSiteScripting() {
  const [mode, setMode] = useState<XssMode>(null)
  const [reflectedOutput, setReflectedOutput] = useState<ReflectedOutput | null>(null)
  const [storedOutput, setStoredOutput] = useState<StoredOutput | null>(null)

  return (
    <div className="flex min-h-svh flex-col p-8 gap-6">

      <div className="flex flex-1 gap-4">

        <Card className="flex-1 shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Was ist Cross-Site Scripting (XSS)?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p>
              Cross-Site Scripting (XSS)-Angriffe sind eine Art von Injection, bei der schädliche Skripte in ansonsten harmlose und vertrauenswürdige Webseiten eingeschleust werden. XSS-Angriffe treten auf, wenn ein Angreifer eine Webanwendung nutzt, um schädlichen Code – in der Regel in Form eines browserseitigen Skripts – an einen anderen Endbenutzer zu senden.
            </p>
            <p>
              Ein Angreifer kann XSS nutzen, um einem ahnungslosen Benutzer ein schädliches Skript zu senden. Der Browser des Endbenutzers hat keine Möglichkeit zu erkennen, dass dem Skript nicht vertraut werden sollte, und führt es aus. Da der Browser davon ausgeht, dass das Skript aus einer vertrauenswürdigen Quelle stammt, kann das schädliche Skript auf alle Cookies, Session-Tokens oder andere sensible Informationen zugreifen, die der Browser gespeichert hat und mit dieser Seite verwendet. Diese Skripte können sogar den Inhalt der HTML-Seite umschreiben.
            </p>
            <p className="text-muted-foreground text-xs">
              Quelle:{' '}
              <a
                href="https://owasp.org/www-community/attacks/xss/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                https://owasp.org/www-community/attacks/xss/
              </a>
            </p>
          </CardContent>
        </Card>

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
                  <DropdownMenuLabel>XSS Attack</DropdownMenuLabel>
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
      <Link to="/cross-site-scripting/schutz" className="fixed bottom-6 right-6">
        <Button className="rounded-lg shadow-lg">
          Welche Schutzmöglichkeiten gibt es?
        </Button>
      </Link>
    
      
    </div>
  )
}
