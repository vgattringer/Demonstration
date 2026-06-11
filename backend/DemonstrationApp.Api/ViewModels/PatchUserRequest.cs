namespace DemonstrationApp.Api.ViewModels;

/// <summary>
/// Payload für PATCH /api/users/{id} — partielles Update.
/// Alle Felder sind optional (nullable): nur mitgeschickte Felder werden überschrieben.
/// </summary>
public record PatchUserRequest(
    string? Username,
    string? FirstName,
    string? LastName,
    string? Email,
    string? City,
    string? PostalCode,
    DateOnly? DateOfBirth,
    string? SocialSecurityNumber,
    string? AuthTan
);
