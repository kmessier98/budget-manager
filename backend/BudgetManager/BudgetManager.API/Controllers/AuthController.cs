using BudgetManager.Application.DTOs.Auth;
using BudgetManager.Application.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
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

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,      // Protects against XSS
                Secure = !_env.IsDevelopment(), // Requires HTTPS
                SameSite = SameSiteMode.Strict, // Protects against CSRF
                Expires = DateTime.UtcNow.AddMinutes(60)
            };
            // Le token va s'enregister dans le cookie du navigateur (faire f12 => application => cookies)
            Response.Cookies.Append("jwt", result.Token ?? string.Empty, cookieOptions);

            return result.IsSuccess ? Ok(new { result.Message }) : Unauthorized(result);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = !_env.IsDevelopment(),
                SameSite = SameSiteMode.Strict,
            };

            Response.Cookies.Delete("jwt", cookieOptions);

            return Ok(new { message = "Déconnexion réussie" });
        }
    }
}
