import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App"

/**
 * Einstiegspunkt der Anwendung.
 *
 * Mountet die React-App in das `<div id="root">`-Element aus `index.html`.
 *
 * @remarks
 * `StrictMode` aktiviert zusätzliche Warnungen und doppelte Render-Checks
 * während der Entwicklung; im Production-Build hat es keinen Laufzeit-Einfluss.
 *
 * `BrowserRouter` stellt den Routing-Kontext für die gesamte Komponentenbaum bereit.
 * Er muss so weit außen wie möglich stehen, damit alle Kindkomponenten
 * auf `useNavigate()`, `useParams()` usw. zugreifen können.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
