using BudgetManager.Domain.Entities;
using BudgetManager.Infrastructure.Data;
using Duende.IdentityServer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();


builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "idsrv.session";
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});


builder.Services.AddIdentityServer()
    .AddInMemoryIdentityResources(new List<IdentityResource>
    {
        new IdentityResources.OpenId(),
        new IdentityResources.Profile()
    })
    .AddInMemoryApiScopes(new List<ApiScope>
    {
        new ApiScope("api.read", "Accès à l'API")
    })
    .AddInMemoryClients(new List<Client>
    {
        new Client
        {
            ClientId = "vue-bff-client",
            ClientSecrets = { new Secret("secret-tres-robuste".Sha256()) },
            AllowedGrantTypes = GrantTypes.Code,

            RedirectUris = { "https://localhost:7208/signin-oidc" },
            PostLogoutRedirectUris = { "https://localhost:7208/signout-callback-oidc" },

            AllowedScopes = { "openid", "profile", "api.read" },
            RequirePkce = true,

            // Configuration du logout
            FrontChannelLogoutUri = "https://localhost:7208/signout-oidc",
            FrontChannelLogoutSessionRequired = true,
            BackChannelLogoutUri = "https://localhost:7208/signout-oidc",
            BackChannelLogoutSessionRequired = true
        }
    })
    .AddDeveloperSigningCredential() // À remplacer en production par un vrai certificat
    .AddAspNetIdentity<ApplicationUser>();

builder.Services.AddRazorPages(); // Pour les pages de login/logout de Duende

var app = builder.Build();

app.UseStaticFiles(); // Indispensable pour charger le design des pages de Login de Duende
app.UseRouting();

// ACTIVER DUENDE
app.UseIdentityServer();
app.UseAuthorization();

app.MapRazorPages(); // Pour les pages de login/logout de Duende

app.Run();
