using BudgetManager.Application.DTOs.Auth;
using BudgetManager.Application.Services;
using BudgetManager.Domain.Entities;
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
    }
}
