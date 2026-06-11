namespace DemonstrationApp.Api.ViewModels;

/// <summary>
/// Response für POST /api/auth/login und /api/auth/login-unsafe.
/// Enthält den gefundenen User sowie den tatsächlich ausgeführten SQL-String —
/// bewusst für die SQL-Injection-Demo, niemals in einer echten Anwendung zurückgeben.
/// </summary>
public record LoginResponse(UserResponse User, string ExecutedSql);
