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
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

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


// 1. IMPORTANT : Remplacer AddIdentityCore par AddIdentity pour avoir accès au SignInManager complet
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 5;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireDigit = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// 2. Configuration personnalisée du Cookie généré par Identity pour votre Frontend
// A NOTER QUE C'EST OPTIONELLE.... LA MÉTHODE PasswordSignInAsync UTILIE LE cookie par défaut de Identity.
// Ici, je fais juste une configuration plus strictre pour le cookie... mais c'est optionnel
// Voir dans f12 / Application / Storage / Cookies pour voir le cookie généré par Identity!!!
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "MonApp_Auth_Cookie";
    options.Cookie.SameSite = SameSiteMode.Strict;   // Protection CSRF absolue
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // HTTPS requis
    options.Cookie.HttpOnly = true;                  // Invisible pour le JavaScript du Frontend (Sécurité XSS)
    options.ExpireTimeSpan = TimeSpan.FromMinutes(15); // Si on ne mets pas, par défaut ca dure 7 jours
    // Conserve le principe du renouvellement automatique à mi-parcours
    options.SlidingExpiration = true;

    // Empêche ASP.NET de rediriger vers une page HTML /Account/Login si le frontend fait un appel non authentifié
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };

    // Empêche également la redirection en cas de permissions insuffisantes (403 Forbidden)
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});

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
