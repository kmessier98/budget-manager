using BudgetManager.Application.DTOs.User;
using BudgetManager.Application.Services;
using BudgetManager.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BudgetManager.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(UserManager<ApplicationUser> userManager) : ControllerBase
    {
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO dto)
        {
            //TODO vérifier newPassword == ConfirmPassword fluentValidation..

            // Récupération automatique et sécurisée de l'ID depuis le JWT (le claim 'nameidentifier')
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new { message = "Utilisateur introuvable."});

            // Modification sécurisée avec vérification de l'ancien mot de passe
            var result = await userManager.ChangePasswordAsync(user, dto.OldPassword, dto.NewPassword);

            if (!result.Succeeded)
            {
                if (result.Errors.Count() == 1)
                {
                    if (result.Errors.Single().Code == "PasswordMismatch")
                    {
                        return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
                    }
                }
                return BadRequest(new { errors = result.Errors.Select(e => e.Code) });
            }
           
            return Ok(new { message = "Mot de passe modifié avec succès." });
        }

        [HttpPost("update-user")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDTO dto)
        {
            //TODO fluentValidation ... verfiier champs sont pas empty et valide email..
            
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new { message = "Utilisateur introuvable." });

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;

            var updateResult = await userManager.UpdateAsync(user);
            if (!updateResult.Succeeded) return BadRequest(updateResult.Errors);

            if (user.Email != dto.Email)
            {
                var emailResult = await userManager.SetEmailAsync(user, dto.Email);
                if (!emailResult.Succeeded) return BadRequest(emailResult.Errors);

                // Optionnell.. met le username le meme que l'email..
                await userManager.SetUserNameAsync(user, dto.Email);
            }

            return Ok("Profil mis à jour avec succès!");
        }
    }
}
