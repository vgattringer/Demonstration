namespace DemonstrationApp.Api.ViewModels;

/// <summary>
/// Payload für POST /api/users — alle Felder sind Pflicht.
/// </summary>
public record CreateUserRequest(
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
