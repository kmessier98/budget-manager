using BudgetManager.API.Configurations;
using BudgetManager.API.Filters.BudgetManager.API.Filters;
using BudgetManager.API.Middlewares;
using BudgetManager.Application;
using BudgetManager.Application.Interfaces.AuthService;
using BudgetManager.Application.Mappings;
using BudgetManager.Application.Services;
using BudgetManager.Application.Validators;
using BudgetManager.Domain.Entities;
using BudgetManager.Infrastructure;
using BudgetManager.Infrastructure.Data;
using BudgetManager.Infrastructure.Security;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuration de l'authentification hybride Cookie + OIDC
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
{
    options.Cookie.Name = "Bff-Session-Spa";
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.HttpOnly = true;

    // Gérer le retour non-autorisé pour les requêtes AJAX de Vue
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
})
.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    options.Authority = "https://localhost:7053"; // Port de Duende
    options.ClientId = "vue-bff-client";
    options.ClientSecret = "secret-tres-robuste";
    options.ResponseType = "code";
    options.SaveTokens = true; // Conserve les tokens dans le cookie de session
    options.GetClaimsFromUserInfoEndpoint = true;


    // Scopes nécessaires
    options.Scope.Clear();
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("api.read");

    // Configuration de la déconnexion
    options.SignedOutRedirectUri = "http://localhost:5173/"; // Retour au frontend après déconnexion

    // Gestion des événements OIDC
    options.Events = new OpenIdConnectEvents
    {
        OnRedirectToIdentityProvider = context =>
        {
            // Si le paramètre "prompt" est défini dans les propriétés d'authentification, l'ajouter à la requête
            if (context.Properties.Items.TryGetValue("prompt", out var promptValue))
            {
                context.ProtocolMessage.SetParameter("prompt", promptValue);
            }
            return Task.CompletedTask;
        }
    };

});


// Ajout du service Problem Details standard
builder.Services.AddProblemDetails();
// Enregistrement du gestionnaire global
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>(); // Ajout notre filtre automatiquement
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // INDISPENSABLE pour autoriser le partage des cookies avec le frontend
    });
});

//  Enregistrement de TOUS les validateurs du projet Application (via le package moderne)
builder.Services.AddValidatorsFromAssemblyContaining<CreateTransactionDTOValidator>();

builder.Services.AddOpenApi(options =>
{
    // Pour l'interface scaler, il faut ajouter le transformateur de schéma de sécurité Bearer
    // Cela permet de pouvoir entrer un token JWT dans l'interface pour tester les endpoints sécurisés
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddIdentityCore<ApplicationUser>(options =>
{
    options.Password.RequiredLength = 5;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireDigit = false;
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>();


// Identity services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<UserAppService>();

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureService();

// On cible l'assembly du validateur pour être sûr de scanner le projet Application
builder.Services.AddAutoMapper(cfg => { }, typeof(MappingProfile).Assembly);

var app = builder.Build();

// Ajout du middleware au pipeline
app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // Adds the visual UI at /scalar/v1
}

app.UseHttpsRedirection();

app.UseCors("frontend");

app.UseAuthentication(); // Important : Avant UseAuthorization
app.UseAuthorization();

app.MapControllers();


// Créer les rôles par défaut si ils n'existent pas déjà dans la base de données
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    string[] roles = ["Admin", "User", "Premium"];

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}

app.Run();
