using BudgetManager.Application.DTOs.Auth;
using BudgetManager.Application.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Mvc;

namespace BudgetManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserAppService _userService;

        public AuthController(UserAppService userAppService)
        {
            _userService = userAppService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            //TOOD fluentValidation pour email valide
            var result = await _userService.RegisterAsync(dto);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpGet("login")]
        public async Task<IActionResult> Login()
        {
            // Déclenche la redirection vers le serveur Duende 
            // Une fois connecté, Duende ramène l'utilisateur ici, l'API crée le cookie, puis redirige vers Vue.js
            return Challenge(new AuthenticationProperties
            {
                RedirectUri = "http://localhost:5173/" // Retour au frontend après succès
            }, OpenIdConnectDefaults.AuthenticationScheme);
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            // Supprime le cookie de l'API ET déconnecte la session sur le serveur Duende
            return SignOut(new AuthenticationProperties
            {
                RedirectUri = "http://localhost:5173/" // Retour au frontend après déconnexion
            }, CookieAuthenticationDefaults.AuthenticationScheme, OpenIdConnectDefaults.AuthenticationScheme);
        }
    }
}
