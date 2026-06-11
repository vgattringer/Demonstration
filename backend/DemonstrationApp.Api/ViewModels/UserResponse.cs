using DemonstrationApp.Api.Models;

namespace DemonstrationApp.Api.ViewModels;

/// <summary>
/// Was die API nach außen zurückgibt.
/// Records sind in C# ideal für DTOs: immutable, kompakt, automatisches Equality.
/// AuthTan wird bewusst nicht zurückgegeben.
/// </summary>
public record UserResponse(
    int Id,
    string Username,
    string FirstName,
    string LastName,
    string Email,
    string City,
    string PostalCode,
    DateOnly DateOfBirth,
    string SocialSecurityNumber
)
{
    /// <summary>
    /// Mappt eine User-Entity auf dieses DTO.
    /// Die Mapping-Logik liegt bewusst hier und nicht im Controller —
    /// so bleibt sie nah am DTO und der Controller bleibt schlank.
    /// </summary>
    public static UserResponse FromEntity(User u) => new(
        u.Id,
        u.Username,
        u.FirstName,
        u.LastName,
        u.Email,
        u.City,
        u.PostalCode,
        u.DateOfBirth,
        u.SocialSecurityNumber
    );
}
