using Microsoft.AspNetCore.Mvc;

// [ApiController] markiert diese Klasse als API-Controller.
// ASP.NET Core erkennt sie dadurch automatisch und aktiviert Features
// wie automatische Modell-Validierung und Problem Details bei Fehlern.
[ApiController]

// [Route] definiert den URL-Pfad zu diesem Controller.
// "api/[controller]" wird zu "api/hello" — [controller] wird durch den
// Klassenname ohne "Controller" ersetzt (HelloController → hello).
[Route("api/[controller]")]
public class HelloController : ControllerBase
{
    // HTTP GET api/hello
    // ActionResult<string> ist typsicherer als IActionResult:
    // Der Compiler weiß, dass im Erfolgsfall ein string zurückkommt.
    // Das ermöglicht bessere IDE-Unterstützung und klarere API-Dokumentation
    // (z.B. wenn später Swagger/OpenAPI hinzukommt).
    [HttpGet]
    public ActionResult<string> Get()
    {
        return Ok("Hallo vom Backend!");
    }
}
