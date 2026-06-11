import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App"

// StrictMode aktiviert zusätzliche Warnungen und Checks während der Entwicklung.
// Im Production-Build hat es keinen Einfluss auf das Verhalten.
//
// BrowserRouter stellt den Routing-Kontext für die gesamte App bereit.
// Er muss so weit außen wie möglich stehen, damit alle Komponenten
// auf useNavigate(), useParams() etc. zugreifen können.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
