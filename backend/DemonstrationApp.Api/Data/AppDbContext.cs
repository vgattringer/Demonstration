using DemonstrationApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DemonstrationApp.Api.Data;

/// <summary>
/// AppDbContext ist die Brücke zwischen der Anwendung und der Datenbank.
/// Entity Framework Core verwendet ihn, um SQL-Abfragen zu generieren
/// und Tabellenstrukturen aus den Model-Klassen abzuleiten.
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    // DbSet repräsentiert eine Tabelle — hier die Tabelle "Users"
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // HasData() befüllt die Tabelle beim ersten Anlegen mit Mock-Daten.
        // Konstruktor-Reihenfolge: username, firstName, lastName, email,
        //                          city, postalCode, dateOfBirth, socialSecurityNumber, authTan
        modelBuilder.Entity<User>().HasData(
            new User("anna.gruber",   "Anna",   "Gruber",  "anna.gruber@example.at",    "Wien",            "1010", new DateOnly(1990,  3, 15), "1234-150390", "482910") { Id = 1  },
            new User("markus.huber",  "Markus", "Huber",   "markus.huber@example.at",   "Graz",            "8010", new DateOnly(1985,  7, 22), "2345-220785", "739104") { Id = 2  },
            new User("sophie.bauer",  "Sophie", "Bauer",   "sophie.bauer@example.at",   "Linz",            "4020", new DateOnly(1993, 11,  8), "3456-081193", "291847") { Id = 3  },
            new User("lukas.wagner",  "Lukas",  "Wagner",  "lukas.wagner@example.at",   "Salzburg",        "5020", new DateOnly(1988,  5, 30), "4567-300588", "615302") { Id = 4  },
            new User("elena.mueller", "Elena",  "Müller",  "elena.mueller@example.at",  "Innsbruck",       "6020", new DateOnly(1995,  2, 14), "5678-140295", "058473") { Id = 5  },
            new User("tobias.schmid", "Tobias", "Schmid",  "tobias.schmid@example.at",  "Klagenfurt",      "9020", new DateOnly(1982,  9,  3), "6789-030982", "374819") { Id = 6  },
            new User("laura.pichler", "Laura",  "Pichler", "laura.pichler@example.at",  "Wels",            "4600", new DateOnly(1997,  6, 19), "7890-190697", "926354") { Id = 7  },
            new User("felix.steiner", "Felix",  "Steiner", "felix.steiner@example.at",  "St. Pölten",      "3100", new DateOnly(1991, 12, 27), "8901-271291", "143678") { Id = 8  },
            new User("nina.hofmann",  "Nina",   "Hofmann", "nina.hofmann@example.at",   "Dornbirn",        "6850", new DateOnly(1986,  4, 11), "9012-110486", "867041") { Id = 9  },
            new User("daniel.eder",   "Daniel", "Eder",    "daniel.eder@example.at",    "Wiener Neustadt", "2700", new DateOnly(1994,  8,  5), "0123-050894", "530296") { Id = 10 }
        );
    }
}
