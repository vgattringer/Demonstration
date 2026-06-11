namespace DemonstrationApp.Api.ViewModels;

/// <summary>
/// Payload für PUT /api/users/{id} — vollständiges Ersetzen des Users.
/// Alle Felder sind Pflicht (im Gegensatz zu PATCH).
/// </summary>
public record UpdateUserRequest(
    string Username,
    string FirstName,
    string LastName,
    string Email,
    string City,
    string PostalCode,
    DateOnly DateOfBirth,
    string SocialSecurityNumber,
    string AuthTan
);
