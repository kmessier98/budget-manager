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
    }
}
