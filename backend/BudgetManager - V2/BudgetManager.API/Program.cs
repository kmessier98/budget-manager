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
            .AllowAnyMethod();
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
    // Configuration des règles de mot de passe pour Identity
    // Mode development : on assouplit les règles pour faciliter les tests
    options.Password.RequiredLength = 5;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireDigit = false;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

/// <summary>
/// Configure la validation des tokens JWT.
/// L'API valide l'authenticité des jetons auprès du serveur Duende spécifié dans Authority.
/// </summary>
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Duende va fournir lui-même les clés de signature (via l'endpoint OIDC metadata)
        options.Authority = "https://localhost:7053"; // URL de votre projet Duende
        options.Audience = "mon_api_resource";        // Enregistré dans Duende
        options.RequireHttpsMetadata = true;

        // .NET 10/9 standard pour garder les claims intacts
        options.MapInboundClaims = false;
    });

builder.Services.AddAuthorization();

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
