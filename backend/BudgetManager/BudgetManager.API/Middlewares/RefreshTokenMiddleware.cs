using BudgetManager.Application.Interfaces.User;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BudgetManager.API.Middlewares
{
    public class RefreshTokenMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IHostEnvironment _env;

        public RefreshTokenMiddleware(RequestDelegate next, IHostEnvironment env)
        {
            _next = next;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // 1. Extraction des jetons depuis les cookies HttpOnly du navigateur
            var accessToken = context.Request.Cookies["X-Access-Token"];
            var refreshToken = context.Request.Cookies["X-Refresh-Token"];

            if (!string.IsNullOrEmpty(refreshToken))
            {
                // Si l'access token est manquant OU s'il est expiré
                if (string.IsNullOrEmpty(accessToken) || IsTokenExpiredOrExpiringSoon(accessToken))
                {
                    // Résolution dynamique du service Scoped dans le middleware
                    var userService = context.RequestServices.GetRequiredService<IUserAppService>();

                    var parts = refreshToken.Split(':');

                    if (parts.Length == 2)
                    {
                        var userId = parts[0];          // L'ID utilisateur
                        var dbRefreshToken = parts[1];  // Le GUID pur stocké en BDD
                        // 3. Appel du service qui vérifie la table AspNetUserTokens d'Identity
                        var refreshResult = await userService.RefreshTokensAsync(userId, dbRefreshToken);

                        if (refreshResult != null && refreshResult.IsSuccess)
                        {
                            // 4. Succès : On écrase le header Authorization pour que [Authorize] fonctionne sur la requête actuelle
                            context.Request.Headers["Authorization"] = $"Bearer {refreshResult.Token}";

                            // 5. Mise à jour des cookies du navigateur avec les nouveaux jetons
                            var isProd = !_env.IsDevelopment();

                        // Ré-emballage pour le prochain cycle
                        var nextCookieRefreshToken = $"{userId}:{refreshResult.RefreshToken}";

                        context.Response.Cookies.Append("X-Access-Token", refreshResult.Token,
                                CreateCookieOptions(DateTime.UtcNow.AddMinutes(15), isProd));

                            context.Response.Cookies.Append("X-Refresh-Token", nextCookieRefreshToken,
                                CreateCookieOptions(DateTime.UtcNow.AddDays(7), isProd));
                        }
                        else
                        {
                            // Échec du rafraîchissement (Ex: Refresh token réutilisé ou expiré)
                            // Optionnel : Nettoyer les cookies corrompus pour forcer la reconnexion
                            context.Response.Cookies.Delete("X-Access-Token");
                            context.Response.Cookies.Delete("X-Refresh-Token");
                        }              
                    }                    
                }
                else
                {

                    // 6. Si le jeton d'accès est toujours valide, on l'injecte simplement dans le Header Authorization
                    // pour que le middleware .AddJwtBearer() d'ASP.NET Core valide l'utilisateur normalement.
                    // permet [Authorize] de fonctionner sur la requête actuelle.
                    context.Request.Headers["Authorization"] = $"Bearer {accessToken}";
                }
            }
                             
             await _next(context);
        }

        private bool IsTokenExpiredOrExpiringSoon(string token)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);
                var expClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "exp")?.Value;

                if (expClaim != null)
                {
                    var expirationTime = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expClaim)).UtcDateTime;
                    // Marge de sécurité de 30 secondes pour éviter les micro-coupures réseau
                    return expirationTime <= DateTime.UtcNow.AddSeconds(30);
                }
            }
            catch { }
            return true; // En cas d'erreur de lecture, on considère le token comme invalide/expiré
        }

        private CookieOptions CreateCookieOptions(DateTime expires, bool isProd) => new()
        {
            HttpOnly = true,
            Secure = isProd,
            SameSite = SameSiteMode.Strict,
            Expires = expires
        };
    }
}
