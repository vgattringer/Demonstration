using System.Diagnostics.CodeAnalysis;

namespace DemonstrationApp.Api.Models;

/// <summary>
/// Repräsentiert einen User in der Datenbank.
/// Diese Klasse ist die Entity — sie bildet 1:1 die Datenbanktabelle ab.
/// Für die API-Kommunikation werden stattdessen die DTOs in /ViewModels verwendet.
/// </summary>
public class User
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string City { get; set; }
    public required string PostalCode { get; set; }
    public DateOnly DateOfBirth { get; set; }

    /// <summary>
    /// Sozialversicherungsnummer — bewusst sensitives Feld für die SQL-Injection-Demo.
    /// </summary>
    public required string SocialSecurityNumber { get; set; }

    /// <summary>
    /// Authentication TAN — wird im Klartext gespeichert (bewusst unsicher für die Demo).
    /// In einer echten Anwendung würde dieser Wert gehasht gespeichert werden.
    /// </summary>
    public required string AuthTan { get; set; }

    /// <summary>
    /// Parameterloser Konstruktor für EF Core.
    /// EF Core benötigt ihn, um Objekte aus der Datenbank zu materialisieren.
    /// protected statt private: zugänglich für abgeleitete Klassen, aber nicht von außen.
    /// </summary>
    protected User() { }

    /// <summary>
    /// Vollständiger Konstruktor für den Anwendungscode.
    /// [SetsRequiredMembers] teilt dem Compiler mit, dass dieser Konstruktor
    /// alle required-Properties befüllt — dadurch entfällt die Compiler-Warnung.
    /// </summary>
    [SetsRequiredMembers]
    public User(string username, string firstName, string lastName, string email,
                string city, string postalCode, DateOnly dateOfBirth,
                string socialSecurityNumber, string authTan)
    {
        Username             = username;
        FirstName            = firstName;
        LastName             = lastName;
        Email                = email;
        City                 = city;
        PostalCode           = postalCode;
        DateOfBirth          = dateOfBirth;
        SocialSecurityNumber = socialSecurityNumber;
        AuthTan              = authTan;
    }
}
