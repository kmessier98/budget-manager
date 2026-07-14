namespace BudgetManager.IdentityServer.Configuration
{
    using Duende.IdentityServer.Models;
    using Duende.IdentityServer.Test;

    public static class Config
    {
        public static IEnumerable<Client> Clients =>
            new List<Client>
            {
                new Client
                {
                    ClientId = "my_frontend_app",
                     AllowedGrantTypes = GrantTypes.Code,
                    RequirePkce = true,
                    RequireClientSecret = false,
                     RedirectUris = { "http://localhost:5173/signin-oidc" },
                    PostLogoutRedirectUris = { "http://localhost:5173/signout-callback-oidc" },
                    AllowedScopes =
                    {
                        "openid",
                        "profile",
                        "monprojet.api"  // Doit correspondre exactement à votre ApiScope plus bas !
                    },
                    AllowOfflineAccess = true // REQUIS pour activer les Refresh Tokens
                }
            };

        public static IEnumerable<ApiResource> ApiResources =>
          new ApiResource[]
          {
            new ApiResource("mon_api_resource", "Mon API Principale")
            {
                // On lie les permissions (scopes) utilisables dans cette API
                Scopes = { "monprojet.api" },

                //On demande à Duende d'extraire TOUS les rôles de l'utilisateur, peu importe leur valeur.
                UserClaims = { "role" }
            }
          };

        public static IEnumerable<ApiScope> ApiScopes =>
            new[]
            {
                new ApiScope("monprojet.api", "Accès complet à l'API")
            };

        public static IEnumerable<IdentityResource> IdentityResources =>
            new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
            };

        public static IEnumerable<TestUser> Users =>
            new List<TestUser>
            {
                new TestUser
                {
                    SubjectId="1",
                    Username="kevin",
                    Password="Password123!"
                }
            };
    }
}
