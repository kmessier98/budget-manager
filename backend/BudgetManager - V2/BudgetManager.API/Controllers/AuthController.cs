using BudgetManager.Application.DTOs.Auth;
using BudgetManager.Application.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BudgetManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserAppService _userService;
        private readonly IWebHostEnvironment _env;

        public AuthController(UserAppService userAppService, IWebHostEnvironment env)
        {
            _userService = userAppService;
            _env = env;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            //TOOD fluentValidation pour email valide
            var result = await _userService.RegisterAsync(dto);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _userService.LoginAsync(dto);
            if (!result.IsSuccess) return Unauthorized(result);

            // Le token va s'enregister dans le cookie du navigateur (faire f12 => application => cookies)
            Response.Cookies.Append("X-Access-Token", result.Token ?? string.Empty, CreateCookieOptions(DateTime.UtcNow.AddMinutes(1)));

            return result.IsSuccess ? Ok(new { result.Message }) : Unauthorized(result);
        }

        [HttpPost("logout/{userId}")]
        public async Task<IActionResult> Logout(string userId)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = !_env.IsDevelopment(),
                SameSite = SameSiteMode.Strict,
            };

            Response.Cookies.Delete("X-Access-Token", cookieOptions);
            //TODO delete refresh token (cookie)
            bool success = await _userService.LogoutAsync(userId);

            return success ? Ok(new { message = "Déconnexion réussie" }) : BadRequest(new { message = "Échec de la déconnexion" });
        }

        private CookieOptions CreateCookieOptions(DateTime expires)
        {
            return new CookieOptions
            {
                HttpOnly = true, // Protects against XSS
                Secure = !_env.IsDevelopment(),  // Requires HTTPS
                SameSite = SameSiteMode.Strict, // Protects against CSRF
                Expires = expires
            };
        }
    }
}
