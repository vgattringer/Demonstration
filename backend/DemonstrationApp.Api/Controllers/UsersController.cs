using DemonstrationApp.Api.Data;
using DemonstrationApp.Api.Models;
using DemonstrationApp.Api.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DemonstrationApp.Api.Controllers;

/// <summary>
/// CRUD-Endpunkte für User.
/// Basis-Route: /api/users
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class UsersController(AppDbContext db) : ControllerBase
{
    // -------------------------------------------------------------------------
    // GET /api/users
    // -------------------------------------------------------------------------

    /// <summary>Gibt alle User zurück.</summary>
    [HttpGet]
    [ProducesResponseType<IEnumerable<UserResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetAll()
    {
        var users = await db.Users
            .Select(u => UserResponse.FromEntity(u))
            .ToListAsync();

        return Ok(users);
    }

    // -------------------------------------------------------------------------
    // GET /api/users/{id}
    // -------------------------------------------------------------------------

    /// <summary>Gibt einen einzelnen User anhand der ID zurück.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType<UserResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserResponse>> GetById(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();

        return Ok(UserResponse.FromEntity(user));
    }

    // -------------------------------------------------------------------------
    // POST /api/users
    // -------------------------------------------------------------------------

    /// <summary>Legt einen neuen User an.</summary>
    [HttpPost]
    [ProducesResponseType<UserResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserResponse>> Create([FromBody] CreateUserRequest request)
    {
        var user = new User(
            request.Username,
            request.FirstName,
            request.LastName,
            request.Email,
            request.City,
            request.PostalCode,
            request.DateOfBirth,
            request.SocialSecurityNumber,
            request.AuthTan
        );

        db.Users.Add(user);
        await db.SaveChangesAsync();

        // 201 Created mit Location-Header auf den neuen Eintrag
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, UserResponse.FromEntity(user));
    }

    // -------------------------------------------------------------------------
    // PUT /api/users/{id}
    // -------------------------------------------------------------------------

    /// <summary>Ersetzt einen User vollständig (alle Felder werden überschrieben).</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType<UserResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserResponse>> Update(int id, [FromBody] UpdateUserRequest request)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();

        user.Username             = request.Username;
        user.FirstName            = request.FirstName;
        user.LastName             = request.LastName;
        user.Email                = request.Email;
        user.City                 = request.City;
        user.PostalCode           = request.PostalCode;
        user.DateOfBirth          = request.DateOfBirth;
        user.SocialSecurityNumber = request.SocialSecurityNumber;
        user.AuthTan              = request.AuthTan;

        await db.SaveChangesAsync();
        return Ok(UserResponse.FromEntity(user));
    }

    // -------------------------------------------------------------------------
    // PATCH /api/users/{id}
    // -------------------------------------------------------------------------

    /// <summary>Aktualisiert einzelne Felder eines Users (nur mitgeschickte Felder werden geändert).</summary>
    [HttpPatch("{id:int}")]
    [ProducesResponseType<UserResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserResponse>> Patch(int id, [FromBody] PatchUserRequest request)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();

        // Nur Felder überschreiben, die tatsächlich im Request enthalten sind (nicht null)
        if (request.Username             is not null) user.Username             = request.Username;
        if (request.FirstName            is not null) user.FirstName            = request.FirstName;
        if (request.LastName             is not null) user.LastName             = request.LastName;
        if (request.Email                is not null) user.Email                = request.Email;
        if (request.City                 is not null) user.City                 = request.City;
        if (request.PostalCode           is not null) user.PostalCode           = request.PostalCode;
        if (request.DateOfBirth          is not null) user.DateOfBirth          = request.DateOfBirth.Value;
        if (request.SocialSecurityNumber is not null) user.SocialSecurityNumber = request.SocialSecurityNumber;
        if (request.AuthTan              is not null) user.AuthTan              = request.AuthTan;

        await db.SaveChangesAsync();
        return Ok(UserResponse.FromEntity(user));
    }

    // -------------------------------------------------------------------------
    // DELETE /api/users/{id}
    // -------------------------------------------------------------------------

    /// <summary>Löscht einen User anhand der ID.</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();

        db.Users.Remove(user);
        await db.SaveChangesAsync();

        return NoContent();
    }
}
