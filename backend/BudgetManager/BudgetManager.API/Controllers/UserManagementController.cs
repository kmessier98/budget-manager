using BudgetManager.Application.DTOs.User;
using BudgetManager.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BudgetManager.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/users")]
    [ApiController]
    public class UserManagementController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public UserManagementController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("{userId}/roles")]
        public async Task<IActionResult> AssignRole(string userId, [FromBody] AssignRoleDTO dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new { message = "Utilisateur introuvable." });


            // Optionnel.... Supprimer le rôle avant d'en ajouter un nouveau...(car sinon ca l'ajoute tjrs les rôles 
            // (un user peut avoir plusieurs rôle...)
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Any())
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeResult.Succeeded)
                    return BadRequest(new { errors = removeResult.Errors.Select(e => e.Code) });
            }

            var result = await _userManager.AddToRoleAsync(user, dto.RoleName);
            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors.Select(e => e.Code) });

            return Ok(new { message = $"Rôle {dto.RoleName} attribué avec succès." });
        }
    }
}

