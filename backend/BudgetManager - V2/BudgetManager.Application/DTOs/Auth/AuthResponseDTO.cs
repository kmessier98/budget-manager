namespace BudgetManager.Application.DTOs.Auth
{
    public record AuthResponseDto(bool IsSuccess, string UserId, string Message, string? Token = null, IEnumerable<string>? Errors = null);
}
