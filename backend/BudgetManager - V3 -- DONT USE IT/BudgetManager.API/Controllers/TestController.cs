using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet("public")]
        public IActionResult Public() => Ok("L'API est accessible sans token !");

        [Authorize]
        [HttpGet("prive")]
        public IActionResult Prive()
        {
            // Récupère l'ID de l'utilisateur connecté depuis le JWT (le claim 'sub')
            var userId = User.FindFirst("sub")?.Value;
            return Ok($"Bravo ! Vous êtes authentifié. Votre ID utilisateur est : {userId}");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public IActionResult AdminOnly() => Ok("Accès accordé : Vous êtes bien un administrateur !");

    }
}
