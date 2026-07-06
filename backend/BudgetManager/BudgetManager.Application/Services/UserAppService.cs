using BudgetManager.Application.DTOs.Auth;
using BudgetManager.Application.Interfaces.AuthService;
using BudgetManager.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace BudgetManager.Application.Services
{
    public class UserAppService
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
            if (userExists != null) return new AuthResponseDto(false, "L'utilisateur existe déjà.");

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

                return new AuthResponseDto(false, "Échec de la création de l'utilisateur.", Errors: errorCodes);
            }
            

            return new AuthResponseDto(true, "Utilisateur créé avec succès !");
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return new AuthResponseDto(false, "Identifiants invalides.");

            var roles = await _userManager.GetRolesAsync(user);
            var token = _authService.GenerateJwtToken(user, roles);

            return new AuthResponseDto(true, "Connexion réussie.", token);
        }

    }
}
