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
    /// Gibt den zugehörigen User sowie den ausgeführten SQL-String zurück (nur für Demo-Zwecke).
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType<LoginResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        // IQueryable aufbauen — noch nicht ausführen
        var query = db.Users.Where(u =>
            u.Username == request.Username &&
            u.AuthTan  == request.AuthTan);

        // ToQueryString() liefert den parametrisierten SQL den EF Core generiert —
        // inklusive der @p0/@p1-Platzhalter, ohne echte Werte einzusetzen.
        var executedSql = query.ToQueryString();

        var user = await query.FirstOrDefaultAsync();

        if (user is null)
            return Unauthorized();

        return Ok(new LoginResponse(UserResponse.FromEntity(user), executedSql));
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
    [ProducesResponseType<LoginResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponse>> LoginUnsafe([FromBody] LoginRequest request)
    {
        // ⚠️ NIEMALS so in einer echten Anwendung!
        // Der Query wird direkt aus Nutzereingaben zusammengebaut — kein Schutz gegen Injection.
        var sql = $"SELECT * FROM Users WHERE Username = '{request.Username}' AND AuthTan = '{request.AuthTan}'";

        var users = await db.Users.FromSqlRaw(sql).ToListAsync();
        var user = users.FirstOrDefault();

        if (user is null)
            return Unauthorized();
        
        return Ok(new LoginResponse(UserResponse.FromEntity(user), sql));
    }
}
