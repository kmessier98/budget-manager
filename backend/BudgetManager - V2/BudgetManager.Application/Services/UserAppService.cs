using BudgetManager.Application.DTOs.Auth;
using BudgetManager.Application.Interfaces.AuthService;
using BudgetManager.Application.Interfaces.User;
using BudgetManager.Domain.Entities;
using BudgetManager.SharedLibrary.Responses;
using Microsoft.AspNetCore.Identity;

namespace BudgetManager.Application.Services
{
    public class UserAppService : IUserAppService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuthService _authService;

        public UserAppService(UserManager<ApplicationUser> userManager, IAuthService authService)
        {
            _userManager = userManager;
            _authService = authService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var userExists = await _userManager.FindByEmailAsync(dto.Email);
            if (userExists != null) return new AuthResponseDto(false, null!, "L'utilisateur existe déjà.");

            ApplicationUser user = new()
            {
                Email = dto.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded) {
                var errorCodes = result.Errors.Select(x => x.Code);

                return new AuthResponseDto(false, user.Id, "Échec de la création de l'utilisateur.", Errors: errorCodes);
            }

            // Note : Le rôle doit déjà exister dans la table AspNetRole =­> Voir fichier program.cs 
            await _userManager.AddToRoleAsync(user, "User");

            return new AuthResponseDto(true, user.Id, "Utilisateur créé avec succès !");
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return new AuthResponseDto(false, null!, "Identifiants invalides.");

            var roles = await _userManager.GetRolesAsync(user);

            // 1. Générer le jeton d'accès JWT classique
            var token = _authService.GenerateJwtToken(user, roles);

            // 2. Générer un Refresh Token unique et sécurisé
            var refreshToken = Guid.NewGuid().ToString();

            // 3. Stocker le Refresh Token nativement dans la table AspNetUserTokens d'Identity
            // "Default" est le fournisseur, "RefreshToken" est le nom de la clé
            await _userManager.SetAuthenticationTokenAsync(user, "Default", "RefreshToken", refreshToken);

            return new AuthResponseDto(true, user.Id, "Connexion réussie.", token, refreshToken);
        }

        public async Task<bool> LogoutAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            // Supprime proprement le Refresh Token de la table AspNetUserTokens
            var result = await _userManager.RemoveAuthenticationTokenAsync(user, "Default", "RefreshToken");

            return result.Succeeded;
        }

        public async Task<AuthResponseDto> RefreshTokensAsync(string userId, string providedRefreshToken)
        {
            // 1. Trouver l'utilisateur dans les tables Identity
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return new AuthResponseDto(false, "Utilisateur introuvable.", null, null);

            // 2. Récupérer le Refresh Token stocké nativement en BDD
            var storedRefreshToken = await _userManager.GetAuthenticationTokenAsync(user, "Default", "RefreshToken");

            // 3. Valider le token (Est-ce que le cookie correspond à la BDD ?)
            if (storedRefreshToken == null || storedRefreshToken != providedRefreshToken)
            {
                return new AuthResponseDto(false, "Jeton de rafraîchissement invalide ou expiré.", null, null);
            }

            // 4. Générer le nouveau Jeton d'accès JWT
            var roles = await _userManager.GetRolesAsync(user);
            var newAccessToken = _authService.GenerateJwtToken(user, roles);

            // 5. Générer et remplacer le Refresh Token (Rotation de sécurité)
            var newRefreshToken = Guid.NewGuid().ToString();
            await _userManager.SetAuthenticationTokenAsync(user, "Default", "RefreshToken", newRefreshToken);

            return new AuthResponseDto(true, userId, "Jetons rafraîchis avec succès.", newAccessToken, newRefreshToken);
        }

    }
}
