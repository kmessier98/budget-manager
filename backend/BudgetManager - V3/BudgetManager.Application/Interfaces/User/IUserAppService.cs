using BudgetManager.Application.DTOs.Auth;

namespace BudgetManager.Application.Interfaces.User
{
    public interface IUserAppService
    {
        public Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    }
}
