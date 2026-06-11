using DemonstrationApp.Api.Data;
using DemonstrationApp.Api.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DemonstrationApp.Api.Controllers;

/// <summary>
/// Authentifizierungs-Endpunkte.
/// Basis-Route: /api/auth
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController(AppDbContext db) : ControllerBase
{
    // -------------------------------------------------------------------------
    // POST /api/auth/login
    // -------------------------------------------------------------------------

    /// <summary>
    /// Prüft Username und TAN gegen die Datenbank.
    /// Gibt den zugehörigen User zurück oder 401 bei ungültigen Zugangsdaten.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType<UserResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserResponse>> Login([FromBody] LoginRequest request)
    {
        // Sicherer Vergleich: beide Felder müssen übereinstimmen.
        // EF Core übersetzt das in ein parametrisiertes SQL — kein Risiko für SQL-Injection.
        var user = await db.Users.FirstOrDefaultAsync(u =>
            u.Username == request.Username &&
            u.AuthTan  == request.AuthTan);

        if (user is null)
            return Unauthorized();

        // AuthTan wird bewusst nicht im Response zurückgegeben
        return Ok(UserResponse.FromEntity(user));
    }

    // -------------------------------------------------------------------------
    // POST /api/auth/login-unsafe
    // -------------------------------------------------------------------------

    /// <summary>
    /// UNSICHERER Login — nur für die SQL-Injection-Demo!
    /// Der SQL-Query wird per String-Konkatenation gebaut, nicht parametrisiert.
    /// Eingabe ' OR '1'='1 als Username umgeht die Authentifizierung.
    /// </summary>
    [HttpPost("login-unsafe")]
    [ProducesResponseType<UserResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserResponse>> LoginUnsafe([FromBody] LoginRequest request)
    {
        // ⚠️ NIEMALS so in einer echten Anwendung!
        // Der Query wird direkt aus Nutzereingaben zusammengebaut — kein Schutz gegen Injection.
        var sql = $"SELECT * FROM Users WHERE Username = '{request.Username}' AND AuthTan = '{request.AuthTan}'";

        var users = await db.Users.FromSqlRaw(sql).ToListAsync();
        var user = users.FirstOrDefault();

        if (user is null)
            return Unauthorized();

        return Ok(UserResponse.FromEntity(user));
    }
}
