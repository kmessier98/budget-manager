using BudgetManager.Domain.Entities;
using BudgetManager.IdentityServer.Configuration;
using BudgetManager.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Connexion à la base de données (la même base de données SQL Server que votre API)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Initialisation d'ASP.NET Core Identity dans Duende (avec AddIdentity pour avoir le SignInManager)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Configuration des règles de mot de passe pour Identity
    // Mode development : on assouplit les règles pour faciliter les tests
    options.Password.RequiredLength = 5;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireDigit = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// 3. Configuration de Duende IdentityServer branché sur votre base de données
builder.Services.AddIdentityServer()
    .AddDeveloperSigningCredential()
    .AddAspNetIdentity<ApplicationUser>() // Duende va lire vos VRAIS utilisateurs en base de données !
    .AddInMemoryClients(Config.Clients)
    .AddInMemoryApiResources(Config.ApiResources)
    .AddInMemoryApiScopes(Config.ApiScopes)
    .AddInMemoryIdentityResources(Config.IdentityResources);

var app = builder.Build();

app.UseStaticFiles(); // Indispensable pour charger le design des pages de Login de Duende
app.UseRouting();

// Démarre le serveur Duende
app.UseIdentityServer();

app.Run();
