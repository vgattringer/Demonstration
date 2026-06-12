using System.Diagnostics.CodeAnalysis;

namespace DemonstrationApp.Api.Models;

/// <summary>
/// Repräsentiert einen gespeicherten Kommentar – verwendet für die Stored-XSS-Demo.
/// </summary>
public class Comment
{
    public int Id { get; set; }

    // ⚠️ Inhalt wird absichtlich NICHT sanitisiert – für die XSS-Demonstration
    public required string Content { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Parameterloser Konstruktor für EF Core
    protected Comment() { }

    [SetsRequiredMembers]
    public Comment(string content)
    {
        Content = content;
    }
}
