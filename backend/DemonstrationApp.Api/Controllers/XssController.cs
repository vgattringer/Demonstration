using System.Net;
using DemonstrationApp.Api.Data;
using DemonstrationApp.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DemonstrationApp.Api.Controllers;

/// <summary>
/// Endpunkte für die Stored-XSS-Demo.
/// Basis-Route: /api/xss
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class XssController(AppDbContext db) : ControllerBase
{
    // -------------------------------------------------------------------------
    // POST /api/xss/comments
    // -------------------------------------------------------------------------

    /// <summary>
    /// Speichert einen Kommentar ohne jegliche Sanitisierung.
    /// ⚠️ Nur für Demo-Zwecke – niemals so in einer echten Anwendung!
    /// </summary>
    [HttpPost("comments-unsafe")]
    [ProducesResponseType<Comment>(StatusCodes.Status201Created)]
    public async Task<ActionResult<Comment>> PostCommentUnsafe([FromBody] string content)
    {
        // ⚠️ UNSICHER: Inhalt wird 1:1 gespeichert – kein Escaping, keine Validierung
        var comment = new Comment(content);
        db.Comments.Add(comment);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(PostCommentUnsafe), comment);
    }

    // -------------------------------------------------------------------------
    // POST /api/xss/comments-safe
    // -------------------------------------------------------------------------

    /// <summary>
    /// Speichert einen Kommentar mit HTML-Encoding – sicher gegen XSS.
    /// </summary>
    [HttpPost("comments-safe")]
    [ProducesResponseType<Comment>(StatusCodes.Status201Created)]
    public async Task<ActionResult<Comment>> PostCommentSafe([FromBody] string content)
    {
        // ✅ SICHER: HtmlEncode wandelt z.B. < in &lt; um – kein Script kann ausgeführt werden
        var sanitized = WebUtility.HtmlEncode(content);
        var comment = new Comment(sanitized);
        db.Comments.Add(comment);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(PostCommentSafe), comment);
    }

    // -------------------------------------------------------------------------
    // GET /api/xss/comments
    // -------------------------------------------------------------------------

    /// <summary>
    /// Gibt alle gespeicherten Kommentare zurück.
    /// </summary>
    [HttpGet("comments")]
    [ProducesResponseType<List<Comment>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<Comment>>> GetComments()
    {
        return Ok(await db.Comments.OrderBy(c => c.CreatedAt).ToListAsync());
    }

    // -------------------------------------------------------------------------
    // DELETE /api/xss/comments
    // -------------------------------------------------------------------------

    /// <summary>
    /// Löscht alle Kommentare – Reset für die Demo.
    /// </summary>
    [HttpDelete("comments")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAllComments()
    {
        db.Comments.RemoveRange(db.Comments);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
