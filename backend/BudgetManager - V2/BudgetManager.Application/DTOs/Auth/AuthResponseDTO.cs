namespace BudgetManager.Application.DTOs.Auth
{
    public record AuthResponseDto(bool IsSuccess, string UserId, string Message, string? Token = null, string? RefreshToken = null, IEnumerable<string>? Errors = null);
}
