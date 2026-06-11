using DemonstrationApp.Api.Data;
using Microsoft.EntityFrameworkCore;

// WebApplicationBuilder ist der Einstiegspunkt jeder ASP.NET Core App.
// Er sammelt alle Konfigurationen (Services, Settings) bevor die App startet.
var builder = WebApplication.CreateBuilder(args);

// --- Services registrieren ---
// Services sind Klassen/Funktionen, die per Dependency Injection nutzbar gemacht werden.
// AddControllers() macht alle Klassen mit [ApiController] als HTTP-Endpunkte verfügbar.
builder.Services.AddControllers();

// CORS (Cross-Origin Resource Sharing) erlaubt es dem Browser,
// Requests von einer anderen Origin (z.B. Vite Dev-Server auf Port 5173)
// an unsere API (Port 8080) zu senden. Ohne CORS blockiert der Browser das.
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Nur Vite Dev-Server erlaubt
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Entity Framework Core mit SQLite registrieren.
// Die Datenbankdatei "app.db" wird im Projektverzeichnis angelegt.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));

// Swagger / OpenAPI — generiert automatisch eine API-Dokumentation
// und stellt unter /swagger eine interaktive UI bereit.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Build() "friert" die Konfiguration ein und erzeugt die laufende App.
// Ab hier können keine Services mehr registriert werden.
var app = builder.Build();

// Datenbank beim Start automatisch anlegen und Migrationen anwenden.
// EnsureCreated() erstellt die Tabellen falls sie noch nicht existieren
// und befüllt sie mit den Seed-Daten aus AppDbContext.OnModelCreating().
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// --- Middleware Pipeline ---
// Middleware sind Bausteine, die jeden HTTP-Request der Reihe nach verarbeiten.
// Die Reihenfolge hier ist wichtig!

// CORS muss vor allem anderen stehen, damit der Browser nicht blockiert wird.
// Wenn der Browser einen Request von localhost:5173 (Vite) an localhost:8080 (.NET) schickt, passiert folgendes:
// Vor dem eigentlichen Request schickt der Browser einen sogenannten Preflight-Request (HTTP OPTIONS).
// Damit fragt er: "Darf ich das überhaupt?" — und wartet auf die Antwort.
// Die CORS-Middleware muss diesen Preflight abfangen und mit den erlaubten Origins, Headers und Methods antworten.
// Steht sie zu spät in der Pipeline, wird der Request vorher von einer anderen Middleware verarbeitet (z.B. Routing oder Auth) —
// und der Preflight bekommt nie eine CORS-Antwort. Der Browser interpretiert das als Ablehnung und blockiert den Request.
app.UseCors("DevCors");

// Swagger UI nur im Development-Modus aktivieren.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // erreichbar unter http://localhost:8080/swagger
}

// Sucht automatisch nach index.html wenn "/" aufgerufen wird.
app.UseDefaultFiles();

// Serviert statische Dateien aus dem wwwroot-Ordner (= der React-Build).
app.UseStaticFiles();

// Aktiviert das Routing zu den API-Controllern (z.B. /api/users).
app.MapControllers();

// Fallback: Alle URLs, die kein API-Endpunkt treffen, liefern index.html zurück.
// Das ist nötig damit React Router clientseitig navigieren kann
// (z.B. /sql-injection direkt im Browser aufrufen).
app.MapFallbackToFile("index.html");

app.Run();
