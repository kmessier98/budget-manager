using BudgetManager.Domain.Entities;

namespace BudgetManager.Application.Interfaces.AuthService
{
    public interface IAuthService
    {
        string GenerateJwtToken(ApplicationUser user, IList<string> roles);
    }
}
