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
import StoredVsReflectedXss from "@/pages/StoredVsReflectedXss"
import XssSchutz from "@/pages/cross-site-scripting/XssSchutz"
import Sast from "@/pages/cross-site-scripting/Sast"
import Dast from "@/pages/cross-site-scripting/Dast"
import Iast from "@/pages/cross-site-scripting/Iast"

// Jeder Eintrag kennt seinen Titel und seinen Zielpfad.
const sections = [
  { id: 1, title: "SQL-Injection",                   path: "/sql-injection" },
  { id: 2, title: "Cross-Site Scripting (XSS)",      path: "/xss" },
  { id: 3, title: "Cross-Site Request Forgery (CSRF)", path: "/csrf" },
  { id: 4, title: "Stored versus Reflected XSS",     path: "/stored-vs-reflected" },
]

// Die Übersichtsseite mit dem Carousel.
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

// Routes bildet die URL auf die jeweilige Komponente ab.
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
      <Route path="/cross-site-scripting/schutz" element={<XssSchutz />} />
      <Route path="/cross-site-scripting/sast"   element={<Sast />} />
      <Route path="/cross-site-scripting/dast"   element={<Dast />} />
      <Route path="/cross-site-scripting/iast"   element={<Iast />} />
      <Route path="/csrf"               element={<CrossSiteRequestForgery />} />
      <Route path="/stored-vs-reflected" element={<StoredVsReflectedXss />} />
    </Routes>
  )
}

export default App
