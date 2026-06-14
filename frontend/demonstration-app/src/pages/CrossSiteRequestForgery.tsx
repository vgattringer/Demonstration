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
import CsrfInfoCard from "@/components/CsrfInfoCard.tsx"
import DeleteCrsf from "@/pages/cross-site-request-forgery/DeleteCrsf.tsx"
import GetCsrf from "@/pages/cross-site-request-forgery/GetCsrf.tsx"
import { GetCsrfCodeTrace, DeleteCsrfCodeTrace } from "@/pages/cross-site-request-forgery/CsrfCodeTrace"

type CsrfMode = "delete" | "get"
type GetPhase = "idle" | "emailChanged" | "takenOver"

export default function CrossSiteRequestForgery() {
  const [mode, setMode] = useState<CsrfMode | null>(null)
  const [getPhase, setGetPhase] = useState<GetPhase>("idle")
  const [csrfDeleted, setCsrfDeleted] = useState(false)

  function handleModeChange(v: string) {
    setMode(v as CsrfMode)
    setGetPhase("idle")
    setCsrfDeleted(false)
  }

  return (
    <div className="flex min-h-svh flex-col p-8 gap-6">

      <div className="flex flex-1 gap-4">

        <CsrfInfoCard className="flex-1 shadow-md" />

        <Card className="flex-1 shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Was passiert bei Cross-Site Request Forgery (CSRF)?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {mode === "delete" ? "DELETE Szenario" : mode === "get" ? "GET Szenario" : "Wähle Demonstration"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>CSRF Attacke</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={mode ?? ""} onValueChange={handleModeChange}>
                    <DropdownMenuRadioItem value="delete">DELETE Szenario</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="get">GET Szenario</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {mode === "delete" && <DeleteCrsf onDeleted={setCsrfDeleted} />}
            {mode === "get" && <GetCsrf onPhaseChange={setGetPhase} />}
          </CardContent>
        </Card>

        <Card className="flex-1 shadow-md">
          <CardHeader>
            <CardTitle className="font-bold">Was passiert im Code?</CardTitle>
          </CardHeader>
          <CardContent>
            {mode === "get" && <GetCsrfCodeTrace phase={getPhase} />}
            {mode === "delete" && <DeleteCsrfCodeTrace deleted={csrfDeleted} />}
            {mode === null && <p className="text-xs text-muted-foreground">Wähle zuerst eine Demonstration aus.</p>}
          </CardContent>
        </Card>

      </div>

      <Link to="/" className="text-sm underline underline-offset-4">
        ← Zurück zur Übersicht
      </Link>

      {/* Fixer Button unten rechts */}
      <Link to="/csrf/schutz" className="fixed bottom-6 right-6">
        <Button className="rounded-lg shadow-lg">
          Welche Schutzmöglichkeiten gibt es?
        </Button>
      </Link>
    </div>
  )
}
