import { Link, Route, Routes } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import SqlInjection from "@/pages/SqlInjection"
import BooleanBasedSqli from "@/pages/sql-injection/BooleanBasedSqli"
import UnionBasedSqli from "@/pages/sql-injection/UnionBasedSqli"
import TimeBasedSqli from "@/pages/sql-injection/TimeBasedSqli"
import SqlInjectionSchutz from "@/pages/sql-injection/SqlInjectionSchutz"
import CrossSiteScripting from "@/pages/CrossSiteScripting"
import CrossSiteRequestForgery from "@/pages/CrossSiteRequestForgery"
import CrsfSchutz from "@/pages/cross-site-request-forgery/CrsfSchutz"
import StoredVsReflectedXss from "@/pages/StoredVsReflectedXss"
import XssSchutz from "@/pages/cross-site-scripting/XssSchutz"
import Sast from "@/pages/cross-site-scripting/Sast"
import Dast from "@/pages/cross-site-scripting/Dast"
import Iast from "@/pages/cross-site-scripting/Iast"

/**
 * Navigationsdaten für die Startseite.
 * Jeder Eintrag definiert einen Carousel-Slide mit Titel und Zielpfad.
 */
const sections = [
  { id: 1, title: "SQL-Injection",                   path: "/sql-injection" },
  { id: 2, title: "Cross-Site Scripting (XSS)",      path: "/xss" },
  { id: 3, title: "Stored versus Reflected XSS",     path: "/stored-vs-reflected" },
  { id: 4, title: "Cross-Site Request Forgery (CSRF)", path: "/csrf" },
]

/**
 * Startseite der Anwendung.
 *
 * Zeigt alle verfügbaren Lerninhalte als scrollbaren Carousel an.
 * Jede Karte navigiert per React Router `<Link>` ohne Seitenreload
 * zur entsprechenden Detailseite.
 */
function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">Was ist...?</h1>

      <Carousel className="w-full max-w-sm" opts={{ loop: true }}>
        <CarouselContent>
          {sections.map((section) => (
            <CarouselItem key={section.id}>
              {/* Link ersetzt <a href> — navigiert ohne Seitenreload */}
              <Link to={section.path}>
                <Card className="cursor-pointer transition-colors hover:bg-accent">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-xl font-semibold text-center">{section.title}</span>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

/**
 * Wurzelkomponente der Anwendung.
 *
 * Definiert alle Client-seitigen Routen via React Router `<Routes>`.
 * Wird von `main.tsx` innerhalb von `<BrowserRouter>` gerendert.
 *
 * @remarks
 * Routenübersicht:
 * - `/`                          → {@link Home}
 * - `/sql-injection`             → SQL-Injection Hauptseite
 * - `/sql-injection/boolean-based` → Boolean-based Blind SQLi Erklärung
 * - `/sql-injection/union-based`   → Union-based SQLi Erklärung
 * - `/sql-injection/time-based`    → Time-based Blind SQLi Erklärung
 * - `/sql-injection/schutz`        → Schutzmaßnahmen SQL-Injection
 * - `/xss`                       → XSS Hauptseite
 * - `/xss/schutz`                → Schutzmaßnahmen XSS
 * - `/xss/sast`                  → SAST Erklärung
 * - `/xss/dast`                  → DAST Erklärung
 * - `/xss/iast`                  → IAST Erklärung
 * - `/csrf`                      → CSRF Hauptseite
 * - `/csrf/schutz`               → Schutzmaßnahmen CSRF
 * - `/stored-vs-reflected`       → Stored vs. Reflected XSS Vergleich
 */
function App() {
  return (
    <Routes>
      <Route path="/"                   element={<Home />} />
      <Route path="/sql-injection"                    element={<SqlInjection />} />
      <Route path="/sql-injection/boolean-based"      element={<BooleanBasedSqli />} />
      <Route path="/sql-injection/union-based"        element={<UnionBasedSqli />} />
      <Route path="/sql-injection/time-based"         element={<TimeBasedSqli />} />
      <Route path="/sql-injection/schutz"             element={<SqlInjectionSchutz />} />
      <Route path="/xss"                element={<CrossSiteScripting />} />
      <Route path="/xss/schutz" element={<XssSchutz />} />
      <Route path="/xss/sast"   element={<Sast />} />
      <Route path="/xss/dast"   element={<Dast />} />
      <Route path="/xss/iast"   element={<Iast />} />
      <Route path="/csrf"               element={<CrossSiteRequestForgery />} />
      <Route path="/csrf/schutz" element={<CrsfSchutz />} />
      <Route path="/stored-vs-reflected" element={<StoredVsReflectedXss />} />
    </Routes>
  )
}

export default App
