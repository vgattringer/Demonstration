namespace DemonstrationApp.Api.ViewModels;

/// <summary>
/// Payload für POST /api/auth/login.
/// </summary>
public record LoginRequest(string Username, string AuthTan);
