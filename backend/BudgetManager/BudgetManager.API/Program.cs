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
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
    // Vos options si nécessaire (ex: options.Password.RequiredLength = 6;)
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders()
.AddUserManager<UserManager<ApplicationUser>>() //  OBLIGATOIRE : Enregistre explicitement le UserManager
.AddSignInManager<SignInManager<ApplicationUser>>();
// 3. Authentification JWT (Mise à jour .NET 10 standard)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Keep the claim names exactly as they appear in the token (no surprise remapping).
    options.MapInboundClaims = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ClockSkew = TimeSpan.Zero,
        NameClaimType = JwtRegisteredClaimNames.Name,
        RoleClaimType = ClaimTypes.Role
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
